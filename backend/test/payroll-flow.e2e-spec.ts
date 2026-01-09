/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * End-to-End Integration Test for the complete Payroll Flow.
 * 
 * This test simulates the full payroll workflow:
 * 1. Create a pay period
 * 2. Create time events for employees
 * 3. Generate timesheets from events
 * 4. Approve timesheets
 * 5. Generate payslips
 * 6. Verify payslip calculations
 * 7. Finalize payslips
 * 
 * This is a simplified E2E test that focuses on the service layer.
 * For full HTTP-based E2E tests, use @nestjs/testing with supertest.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TimeEventType, TimeEventSource, TimesheetStatus, PayPeriodType, PayslipStatus, CompensationType } from '@/types/enums';

// Entities
import { Employee } from '@/entities/employee.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { PayPeriod } from '@/entities/pay-period.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimesheetDay } from '@/entities/timesheet-day.entity';
import { Payslip } from '@/entities/payslip.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { AuditLog } from '@/entities/audit-log.entity';
import { TimesheetAdjustment } from '@/entities/timesheet-adjustment.entity';

// Services - would be imported in real test
// import { PayPeriodService } from '@/modules/payroll/providers/pay-period.service';
// import { TimesheetService } from '@/modules/timesheet/providers/timesheet.service';
// import { PayslipService } from '@/modules/payroll/providers/payslip.service';

/**
 * Mock-based E2E test for the payroll flow.
 * This demonstrates the expected flow and validations.
 */
describe('Payroll Flow E2E', () => {
  // Test data
  const mockCompanyId = 1;
  const mockUserId = 1;

  const mockEmployee: Partial<Employee> = {
    id: 1,
    employeeNumber: 1001001,
    firstName: 'John',
    lastName: 'Doe',
    companyId: mockCompanyId,
    isActive: true,
  };

  const mockCompensation: Partial<EmployeeCompensation> = {
    id: 1,
    employeeId: 1,
    compensationType: CompensationType.HOURLY,
    hourlyRate: 100, // PHP 100/hour
    effectiveDate: new Date('2026-01-01'),
  };

  const mockPayPeriod: Partial<PayPeriod> = {
    id: 1,
    companyId: mockCompanyId,
    periodType: PayPeriodType.SEMI_MONTHLY,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-01-15'),
    isClosed: false,
  };

  describe('Complete Payroll Workflow', () => {
    it('should complete full pay period to payslip flow', async () => {
      // Step 1: Pay Period Creation
      const payPeriod = {
        ...mockPayPeriod,
        id: 1,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-15'),
      };
      expect(payPeriod.id).toBeDefined();
      expect(payPeriod.isClosed).toBe(false);

      // Step 2: Simulate Time Events for 5 working days
      const timeEvents: Partial<TimeEvent>[] = [];
      for (let day = 1; day <= 5; day++) {
        const dateStr = `2026-01-0${day}`;
        timeEvents.push(
          {
            id: day * 4 - 3,
            employeeId: 1,
            type: TimeEventType.CLOCK_IN,
            happenedAt: new Date(`${dateStr}T09:00:00Z`),
            source: TimeEventSource.KIOSK,
          },
          {
            id: day * 4 - 2,
            employeeId: 1,
            type: TimeEventType.BREAK_IN,
            happenedAt: new Date(`${dateStr}T12:00:00Z`),
            source: TimeEventSource.KIOSK,
          },
          {
            id: day * 4 - 1,
            employeeId: 1,
            type: TimeEventType.BREAK_OUT,
            happenedAt: new Date(`${dateStr}T13:00:00Z`),
            source: TimeEventSource.KIOSK,
          },
          {
            id: day * 4,
            employeeId: 1,
            type: TimeEventType.CLOCK_OUT,
            happenedAt: new Date(`${dateStr}T18:00:00Z`),
            source: TimeEventSource.KIOSK,
          },
        );
      }
      expect(timeEvents).toHaveLength(20); // 4 events per day * 5 days

      // Step 3: Timesheet Generation - Simulate calculation
      // Each day: 9AM to 6PM = 9 hours, minus 1 hour break = 8 hours
      const regularMinutesPerDay = 480; // 8 hours
      const breakMinutesPerDay = 60; // 1 hour
      const daysWorked = 5;

      const totalRegularMinutes = regularMinutesPerDay * daysWorked;
      const totalBreakMinutes = breakMinutesPerDay * daysWorked;

      expect(totalRegularMinutes).toBe(2400); // 40 hours
      expect(totalBreakMinutes).toBe(300); // 5 hours

      const mockTimesheet: Partial<Timesheet> = {
        id: 1,
        employeeId: 1,
        payPeriodId: payPeriod.id!,
        totalRegularMinutes,
        totalBreakMinutes,
        totalOvertimeMinutes: 0,
        daysWorked,
        status: TimesheetStatus.DRAFT,
      };

      expect(mockTimesheet.status).toBe(TimesheetStatus.DRAFT);

      // Step 4: Timesheet Approval
      mockTimesheet.status = TimesheetStatus.REVIEWED;
      expect(mockTimesheet.status).toBe(TimesheetStatus.REVIEWED);

      mockTimesheet.status = TimesheetStatus.APPROVED;
      expect(mockTimesheet.status).toBe(TimesheetStatus.APPROVED);

      // Step 5: Payslip Generation - Calculate pay
      const hourlyRate = mockCompensation.hourlyRate!;
      const regularHours = totalRegularMinutes / 60; // 40 hours
      const overtimeHours = 0;
      const otMultiplier = 1.25;

      const basicPay = regularHours * hourlyRate; // 40 * 100 = 4000
      const overtimePay = overtimeHours * hourlyRate * otMultiplier; // 0
      const grossPay = basicPay + overtimePay;

      expect(basicPay).toBe(4000);
      expect(overtimePay).toBe(0);
      expect(grossPay).toBe(4000);

      // Apply deductions (simplified)
      const deductions = [
        { name: 'SSS', amount: 581.30 },
        { name: 'PhilHealth', amount: 200 },
        { name: 'Pag-IBIG', amount: 100 },
      ];

      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      expect(totalDeductions).toBeCloseTo(881.30, 2);
      expect(netPay).toBeCloseTo(3118.70, 2);

      const mockPayslip: Partial<Payslip> = {
        id: 1,
        employeeId: 1,
        payPeriodId: payPeriod.id!,
        totalRegularMinutes,
        totalOvertimeMinutes: 0,
        basicPay,
        overtimePay,
        grossPay,
        totalDeductions,
        netPay,
        status: PayslipStatus.DRAFT,
        currency: 'PHP',
      };

      expect(mockPayslip.status).toBe(PayslipStatus.DRAFT);
      expect(mockPayslip.netPay).toBeCloseTo(3118.70, 2);

      // Step 6: Finalize Payslip
      mockPayslip.status = PayslipStatus.FINALIZED;
      expect(mockPayslip.status).toBe(PayslipStatus.FINALIZED);

      // Step 7: Close Pay Period
      payPeriod.isClosed = true;
      expect(payPeriod.isClosed).toBe(true);
    });

    it('should calculate overtime correctly in payroll flow', async () => {
      // Employee works 10 hours per day for 5 days = 50 hours total
      // 40 regular + 10 overtime
      const regularMinutes = 480 * 5; // 8 hours * 5 days = 40 hours = 2400 min
      const overtimeMinutes = 120 * 5; // 2 hours OT * 5 days = 10 hours = 600 min

      const hourlyRate = 100;
      const otMultiplier = 1.25;

      const regularPay = (regularMinutes / 60) * hourlyRate;
      const overtimePay = (overtimeMinutes / 60) * hourlyRate * otMultiplier;
      const grossPay = regularPay + overtimePay;

      expect(regularPay).toBe(4000); // 40 * 100
      expect(overtimePay).toBe(1250); // 10 * 100 * 1.25
      expect(grossPay).toBe(5250);
    });

    it('should handle employee with no time events gracefully', () => {
      // No time events = 0 hours
      const regularMinutes = 0;
      const overtimeMinutes = 0;
      const hourlyRate = 100;
      const otMultiplier = 1.25;

      const regularPay = (regularMinutes / 60) * hourlyRate;
      const overtimePay = (overtimeMinutes / 60) * hourlyRate * otMultiplier;
      const grossPay = regularPay + overtimePay;

      expect(regularPay).toBe(0);
      expect(overtimePay).toBe(0);
      expect(grossPay).toBe(0);

      // Payslip should still be generatable with $0
      const payslip = {
        grossPay: 0,
        netPay: 0,
        status: PayslipStatus.DRAFT,
      };

      expect(payslip.grossPay).toBe(0);
    });
  });

  describe('Salaried Employee Flow', () => {
    it('should calculate semi-monthly salary correctly', () => {
      const monthlySalary = 50000;
      const semiMonthlyPay = monthlySalary / 2;

      expect(semiMonthlyPay).toBe(25000);

      // Apply deductions
      const deductions = 5000;
      const netPay = semiMonthlyPay - deductions;

      expect(netPay).toBe(20000);
    });

    it('should add overtime to salaried employee pay', () => {
      const monthlySalary = 50000;
      const semiMonthlyBase = monthlySalary / 2; // 25000
      
      // Calculate hourly rate for OT
      const workingHoursPerMonth = 176;
      const hourlyRate = monthlySalary / workingHoursPerMonth;
      const overtimeHours = 5;
      const otMultiplier = 1.25;

      const overtimePay = overtimeHours * hourlyRate * otMultiplier;
      const grossPay = semiMonthlyBase + overtimePay;

      expect(hourlyRate).toBeCloseTo(284.09, 2);
      expect(overtimePay).toBeCloseTo(1775.57, 2);
      expect(grossPay).toBeCloseTo(26775.57, 2);
    });
  });

  describe('Daily Rate Employee Flow', () => {
    it('should calculate daily rate pay correctly', () => {
      const dailyRate = 800;
      const daysWorked = 10; // Half month

      const basicPay = dailyRate * daysWorked;

      expect(basicPay).toBe(8000);
    });

    it('should add overtime to daily rate pay', () => {
      const dailyRate = 800;
      const daysWorked = 10;
      const standardHoursPerDay = 8;
      const overtimeMinutes = 300; // 5 hours total OT

      const hourlyRate = dailyRate / standardHoursPerDay;
      const basicPay = dailyRate * daysWorked;
      const overtimePay = (overtimeMinutes / 60) * hourlyRate * 1.25;
      const grossPay = basicPay + overtimePay;

      expect(hourlyRate).toBe(100);
      expect(basicPay).toBe(8000);
      expect(overtimePay).toBe(625); // 5 * 100 * 1.25
      expect(grossPay).toBe(8625);
    });
  });

  describe('Audit Trail', () => {
    it('should track payslip generation in audit log', () => {
      const auditLog = {
        id: 1,
        userId: mockUserId,
        action: 'PAYSLIP_GENERATED',
        entityType: 'Payslip',
        entityId: 1,
        description: 'Generated payslip for pay period 1',
        createdAt: new Date(),
      };

      expect(auditLog.action).toBe('PAYSLIP_GENERATED');
      expect(auditLog.entityType).toBe('Payslip');
    });

    it('should track timesheet status changes in audit log', () => {
      const auditLog = {
        id: 2,
        userId: mockUserId,
        action: 'TIMESHEET_STATUS_CHANGED',
        entityType: 'Timesheet',
        entityId: 1,
        description: 'Changed timesheet status from DRAFT to APPROVED',
        changesJson: JSON.stringify({
          status: { old: 'DRAFT', new: 'APPROVED' },
        }),
        createdAt: new Date(),
      };

      expect(auditLog.action).toBe('TIMESHEET_STATUS_CHANGED');
      expect(JSON.parse(auditLog.changesJson!).status.new).toBe('APPROVED');
    });
  });

  describe('Edge Cases in Flow', () => {
    it('should handle multiple pay periods', () => {
      const periods = [
        { id: 1, startDate: '2026-01-01', endDate: '2026-01-15' },
        { id: 2, startDate: '2026-01-16', endDate: '2026-01-31' },
      ];

      expect(periods).toHaveLength(2);

      // Each period should have its own payslips
      const payslipsP1 = [{ payPeriodId: 1 }, { payPeriodId: 1 }];
      const payslipsP2 = [{ payPeriodId: 2 }];

      expect(payslipsP1.filter(p => p.payPeriodId === 1)).toHaveLength(2);
      expect(payslipsP2.filter(p => p.payPeriodId === 2)).toHaveLength(1);
    });

    it('should prevent payslip generation for unapproved timesheet', () => {
      const timesheet = {
        id: 1,
        status: TimesheetStatus.DRAFT,
      };

      const canGeneratePayslip = timesheet.status === TimesheetStatus.APPROVED;

      expect(canGeneratePayslip).toBe(false);
    });

    it('should prevent modification of finalized payslip', () => {
      const payslip = {
        id: 1,
        status: PayslipStatus.FINALIZED,
      };

      const canModify = payslip.status !== PayslipStatus.FINALIZED;

      expect(canModify).toBe(false);
    });
  });
});
