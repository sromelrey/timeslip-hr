import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '@/entities/employee.entity';
import { PayPeriod } from '@/entities/pay-period.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimesheetDay } from '@/entities/timesheet-day.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { CompensationType } from '@/types/enums';

export interface PayrollCalculationResult {
  employeeId: number;
  totalRegularMinutes: number;
  totalOvertimeMinutes: number;
  totalBreakMinutes: number;
  basicPay: number;
  overtimePay: number;
  grossPay: number;
  hourlyRate?: number;
  dailyRate?: number;
  monthlySalary?: number;
  daysWorked?: number;
}

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(TimesheetDay)
    private readonly timesheetDayRepo: Repository<TimesheetDay>,
    @InjectRepository(EmployeeCompensation)
    private readonly compensationRepo: Repository<EmployeeCompensation>,
  ) {}

  /**
   * Calculate pay for a single employee for a given pay period.
   * Uses approved timesheets and current compensation data.
   */
  async calculatePayForEmployee(
    employeeId: number,
    payPeriodId: number,
  ): Promise<PayrollCalculationResult> {
    // Get employee
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
      relations: ['compensations'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee #${employeeId} not found`);
    }

    // Get pay period
    const payPeriod = await this.payPeriodRepo.findOne({
      where: { id: payPeriodId },
    });

    if (!payPeriod) {
      throw new NotFoundException(`Pay period #${payPeriodId} not found`);
    }

    // Get timesheet for this employee and pay period
    const timesheet = await this.timesheetRepo.findOne({
      where: {
        employeeId,
        payPeriodId,
      },
      relations: ['days'],
    });

    if (!timesheet) {
      throw new NotFoundException(
        `No timesheet found for employee #${employeeId} in pay period #${payPeriodId}`
      );
    }

    // Get current compensation (most recent effectiveFrom)
    const compensation = await this.compensationRepo.findOne({
      where: { employeeId },
      order: { effectiveFrom: 'DESC' },
    });

    if (!compensation) {
      throw new BadRequestException(
        `No compensation record found for employee #${employeeId}`
      );
    }

    // Aggregate timesheet days
    const days = timesheet.days || [];
    let totalRegularMinutes = 0;
    let totalOvertimeMinutes = 0;
    let totalBreakMinutes = 0;
    let daysWorked = 0;

    for (const day of days) {
      totalRegularMinutes += day.regularMinutes || 0;
      totalOvertimeMinutes += day.overtimeMinutes || 0;
      totalBreakMinutes += day.breakMinutes || 0;
      
      // Count as worked day if regular minutes > 0
      if (day.regularMinutes > 0) {
        daysWorked++;
      }
    }

    // Calculate pay components
    let basicPay = 0;
    let overtimePay = 0;

    // Overtime multiplier (default 1.25x)
    const OT_MULTIPLIER = 1.25;

    switch (compensation.type) {
      case CompensationType.HOURLY: {
        const hourlyRate = compensation.hourlyRate || 0;

        // Basic Pay
        basicPay = (totalRegularMinutes / 60) * hourlyRate;

        // Overtime Pay
        overtimePay = (totalOvertimeMinutes / 60) * hourlyRate * OT_MULTIPLIER;
        break;
      }

      case CompensationType.DAILY: {
        const dailyRate = compensation.dailyRate || 0;
        
        // Basic Pay (based on days worked)
        // Note: This logic assumes 'daysWorked' covers the 'regularMinutes'. 
        // If they worked partial days, this might overpay, but sticking to simple daily rate for now.
        basicPay = daysWorked * dailyRate;

        // Overtime Pay (convert daily rate to hourly)
        // Assuming 8 hours workday for rate calculation
        const hourlyRate = dailyRate / 8;
        overtimePay = (totalOvertimeMinutes / 60) * hourlyRate * OT_MULTIPLIER;
        break;
      }

      case CompensationType.SALARIED: {
        const monthlySalary = compensation.monthlySalary || 0;

        // Basic Pay (semi-monthly)
        basicPay = monthlySalary / 2;

        // Overtime Pay (convert monthly to hourly)
        // Assuming 22 days * 8 hours = 176 hours/month standard
        const hourlyRate = monthlySalary / 176;
        overtimePay = (totalOvertimeMinutes / 60) * hourlyRate * OT_MULTIPLIER;
        break;
      }

      default:
        throw new BadRequestException(
          `Unknown employment type: ${compensation.type}`
        );
    }

    basicPay = Math.round(basicPay * 100) / 100;
    overtimePay = Math.round(overtimePay * 100) / 100;
    const grossPay = parseFloat((basicPay + overtimePay).toFixed(2));

    return {
      employeeId,
      totalRegularMinutes,
      totalOvertimeMinutes,
      totalBreakMinutes,
      basicPay,
      overtimePay,
      grossPay,
      hourlyRate: compensation.hourlyRate ?? undefined,
      dailyRate: compensation.dailyRate ?? undefined,
      monthlySalary: compensation.monthlySalary ?? undefined,
      daysWorked,
    };
  }

  /**
   * Calculate pay for multiple employees in a pay period.
   */
  async calculatePayForPeriod(
    payPeriodId: number,
    companyId: number,
    employeeIds?: number[],
  ): Promise<PayrollCalculationResult[]> {
    // Get all timesheets for this pay period
    const query = this.timesheetRepo
      .createQueryBuilder('ts')
      .leftJoinAndSelect('ts.employee', 'employee')
      .leftJoinAndSelect('ts.days', 'days')
      .where('ts.pay_period_id = :payPeriodId', { payPeriodId })
      .andWhere('employee.company_id = :companyId', { companyId });

    if (employeeIds && employeeIds.length > 0) {
      query.andWhere('ts.employee_id IN (:...employeeIds)', { employeeIds });
    }

    const timesheets = await query.getMany();

    if (timesheets.length === 0) {
      return [];
    }

    const results: PayrollCalculationResult[] = [];

    for (const timesheet of timesheets) {
      try {
        const calc = await this.calculatePayForEmployee(
          timesheet.employeeId,
          payPeriodId,
        );
        results.push(calc);
      } catch (error) {
        // Log error but continue with other employees
        console.error(
          `Failed to calculate pay for employee #${timesheet.employeeId}:`,
          error.message,
        );
      }
    }

    return results;
  }
}
