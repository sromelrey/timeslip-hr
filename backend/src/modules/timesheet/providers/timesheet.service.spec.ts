/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimesheetService } from './timesheet.service';
import { TimeEventType, TimesheetStatus } from '@/types/enums';
import { TimeEvent } from '@/entities/time-event.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

/**
 * Unit tests for TimesheetService
 */
describe('TimesheetService', () => {
  let service: TimesheetService;
  let mockTimesheetRepo: any;
  let mockDayRepo: any;
  let mockAdjRepo: any;
  let mockAudit: any;

  beforeEach(() => {
    mockTimesheetRepo = { findOne: jest.fn() };
    mockDayRepo = { findOneBy: jest.fn(), create: jest.fn(), save: jest.fn() };
    mockAdjRepo = { create: jest.fn(), save: jest.fn() };
    mockAudit = { log: jest.fn() };

    service = new (TimesheetService as any)(
      mockTimesheetRepo,
      mockDayRepo,
      mockAdjRepo,
      {}, // payPeriodRepo
      {}, // employeeRepo
      {}, // timeEventRepo
      mockAudit,
    );
  });

  // Helper to create a mock TimeEvent
  const createEvent = (type: TimeEventType, time: string): Partial<TimeEvent> => ({
    type,
    happenedAt: new Date(time),
  });

  describe('addManualEntry', () => {
    const dto = {
      workDate: '2025-01-20',
      regularMinutes: 480,
      overtimeMinutes: 0,
      reason: 'Forgot to clock in',
    };

    it('should successfully add a manual entry for a new day', async () => {
      // Mock timesheet found
      mockTimesheetRepo.findOne.mockResolvedValue({
        id: 1,
        status: TimesheetStatus.DRAFT,
        payPeriod: { startDate: '2025-01-16', endDate: '2025-01-31', companyId: 1 },
      });

      // Mock day not found
      mockDayRepo.findOneBy.mockResolvedValue(null);
      // Mock create day
      const newDay = { id: 100, regularMinutes: 0, overtimeMinutes: 0 };
      mockDayRepo.create.mockReturnValue(newDay);
      mockDayRepo.save.mockResolvedValue(newDay);

      // Mock adjustments
      mockAdjRepo.create.mockReturnValue({ id: 1 });

      const result = await service.addManualEntry(1, dto, 99, 1);

      expect(result).toBeDefined();
      expect(mockDayRepo.save).toHaveBeenCalledTimes(2); // Once for create, once for update
      expect(mockAdjRepo.save).toHaveBeenCalledTimes(2); // Regular and Overtime
      expect(mockAudit.log).toHaveBeenCalled();
    });

    it('should throw error if timesheet not found', async () => {
      mockTimesheetRepo.findOne.mockResolvedValue(null);
      await expect(service.addManualEntry(1, dto, 99, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw error if timesheet is locked', async () => {
      mockTimesheetRepo.findOne.mockResolvedValue({
        id: 1,
        status: TimesheetStatus.LOCKED,
        payPeriod: { startDate: '2025-01-16', endDate: '2025-01-31', companyId: 1 },
      });
      await expect(service.addManualEntry(1, dto, 99, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if date is outside pay period', async () => {
      mockTimesheetRepo.findOne.mockResolvedValue({
        id: 1,
        status: TimesheetStatus.DRAFT,
        payPeriod: { startDate: '2025-01-01', endDate: '2025-01-15', companyId: 1 },
      });
      // dto date is 2025-01-20
      await expect(service.addManualEntry(1, dto, 99, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('calculateDayHours', () => {
    it('should calculate regular hours for a standard 8-hour shift', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // 8 hours
      expect(result.overtimeMinutes).toBe(0);
      expect(result.breakMinutes).toBe(0);
      expect(result.anomalies).toHaveLength(0);
    });

    it('should calculate overtime for shifts over 8 hours', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T19:00:00Z'), // 10 hours
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // 8 hours standard
      expect(result.overtimeMinutes).toBe(120); // 2 hours OT
      expect(result.anomalies).toHaveLength(0);
    });

    it('should subtract break time from regular minutes', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T13:00:00Z'), // 1 hour break
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T18:00:00Z'), // 9 hours total - 1 hour break = 8 hours
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // 8 hours (9 - 1 = 8)
      expect(result.breakMinutes).toBe(60);
      expect(result.overtimeMinutes).toBe(0);
      expect(result.anomalies).toHaveLength(0);
    });

    it('should detect missing CLOCK_OUT and create anomaly', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        // No CLOCK_OUT
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toHaveLength(1);
      expect(result.anomalies[0]).toContain('Missing CLOCK_OUT');
    });

    it('should detect double CLOCK_IN and create anomaly', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T10:00:00Z'), // Double clock in
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toHaveLength(1);
      expect(result.anomalies[0]).toContain('Double CLOCK_IN');
    });

    it('should detect CLOCK_OUT without CLOCK_IN', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toHaveLength(1);
      expect(result.anomalies[0]).toContain('CLOCK_OUT without CLOCK_IN');
    });

    it('should handle multiple breaks correctly', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T08:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T10:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T10:15:00Z'), // 15 min
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T13:00:00Z'), // 60 min
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:15:00Z'), // 9h15m total
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.breakMinutes).toBe(75); // 15 + 60
      // Total work: 9h15m = 555 min, minus 75 min break = 480 min = 8 hours
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(0);
      expect(result.anomalies).toHaveLength(0);
    });

    it('should detect missing BREAK_OUT', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        // No BREAK_OUT
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toHaveLength(1);
      expect(result.anomalies[0]).toContain('Missing BREAK_OUT');
    });
  });
});
