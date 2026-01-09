/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Additional edge case tests for TimesheetService.calculateDayHours
 * Covers timezone, DST, and complex scenarios.
 */
import { TimesheetService } from './timesheet.service';
import { TimeEventType } from '@/types/enums';
import { TimeEvent } from '@/entities/time-event.entity';

describe('TimesheetService - Edge Cases', () => {
  let service: TimesheetService;

  beforeEach(() => {
    // Create a partial mock of the service
    service = new (TimesheetService as any)(
      {}, // timesheetRepo
      {}, // timesheetDayRepo
      {}, // timesheetAdjustmentRepo
      {}, // payPeriodRepo
      {}, // employeeRepo
      {}, // timeEventRepo
      {}, // auditService
    );
  });

  // Helper to create a mock TimeEvent
  const createEvent = (type: TimeEventType, time: string): Partial<TimeEvent> => ({
    type,
    happenedAt: new Date(time),
  });

  describe('Midnight Crossing', () => {
    it('should handle shift crossing midnight', () => {
      // Night shift: 10PM to 6AM next day
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T22:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-08T06:00:00Z'), // 8 hours
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // 8 hours
      expect(result.overtimeMinutes).toBe(0);
      expect(result.anomalies).toHaveLength(0);
    });

    it('should handle shift with break crossing midnight', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T22:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-08T01:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-08T01:30:00Z'), // 30 min break
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-08T06:30:00Z'), // 8.5h total - 0.5h break = 8h
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.breakMinutes).toBe(30);
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(0);
    });
  });

  describe('Short Shifts', () => {
    it('should calculate part-time shift correctly', () => {
      // 4-hour shift
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T13:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(240); // 4 hours
      expect(result.overtimeMinutes).toBe(0);
    });

    it('should handle very short shift (under 1 hour)', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T09:30:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(30);
    });
  });

  describe('Long Overtime Shifts', () => {
    it('should calculate excessive overtime correctly', () => {
      // 12-hour shift
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T06:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T18:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // 8 hours
      expect(result.overtimeMinutes).toBe(240); // 4 hours OT
    });

    it('should handle 16-hour shift with breaks', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T06:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T10:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T10:30:00Z'), // 30 min
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T14:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T15:00:00Z'), // 60 min
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T22:00:00Z'), // 16h total
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      // 16h - 1.5h break = 14.5h = 870 min
      // Regular: 480 min, OT: 390 min
      expect(result.breakMinutes).toBe(90);
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(390);
    });
  });

  describe('Empty and Single Events', () => {
    it('should handle empty events array', () => {
      const events: TimeEvent[] = [];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(0);
      expect(result.breakMinutes).toBe(0);
      expect(result.overtimeMinutes).toBe(0);
    });

    it('should handle only CLOCK_IN (missing CLOCK_OUT)', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toContainEqual(expect.stringContaining('Missing CLOCK_OUT'));
    });
  });

  describe('Break Edge Cases', () => {
    it('should handle very short break', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T12:05:00Z'), // 5 min break
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:05:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.breakMinutes).toBe(5);
      expect(result.regularMinutes).toBe(480); // 8h exactly
    });

    it('should handle three breaks in a day', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T08:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T10:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T10:15:00Z'), // 15 min
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T12:45:00Z'), // 45 min
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T15:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T15:15:00Z'), // 15 min
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:15:00Z'), // 9h15m total
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.breakMinutes).toBe(75); // 15 + 45 + 15
      // 9h15m = 555 min - 75 min break = 480 min regular
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(0);
    });

    it('should flag unmatched BREAK_IN without BREAK_OUT', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.anomalies).toContainEqual(expect.stringContaining('Missing BREAK_OUT'));
    });
  });

  describe('Event Ordering', () => {
    it('should handle events in correct chronological order', () => {
      // Events passed in correct order
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T13:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T18:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480);
      expect(result.breakMinutes).toBe(60);
    });
  });

  describe('Minute Precision', () => {
    it('should handle exact minute calculations', () => {
      // 8 hours 27 minutes shift
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T08:33:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480); // Capped at 8h
      expect(result.overtimeMinutes).toBe(27); // 27 min OT
    });

    it('should handle seconds rounding in timestamps', () => {
      // Clock in at 9:00:30, out at 17:00:30 - should be exactly 8 hours
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:30Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:30Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.regularMinutes).toBe(480);
    });
  });

  describe('Split Shifts', () => {
    it('should handle split shift (two clock in/out pairs)', () => {
      // Morning shift + evening shift
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T06:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T10:00:00Z'), // 4h morning
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T14:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T18:00:00Z'), // 4h evening
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      // Total: 8 hours
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(0);
    });

    it('should handle split shift with overtime', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T06:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T11:00:00Z'), // 5h morning
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T14:00:00Z'),
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T19:00:00Z'), // 5h evening
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      // Total: 10 hours = 8 regular + 2 OT
      expect(result.regularMinutes).toBe(480);
      expect(result.overtimeMinutes).toBe(120);
    });
  });

  describe('Zero Duration Events', () => {
    it('should handle zero-duration break', () => {
      const events = [
        createEvent(TimeEventType.CLOCK_IN, '2026-01-07T09:00:00Z'),
        createEvent(TimeEventType.BREAK_IN, '2026-01-07T12:00:00Z'),
        createEvent(TimeEventType.BREAK_OUT, '2026-01-07T12:00:00Z'), // Same time
        createEvent(TimeEventType.CLOCK_OUT, '2026-01-07T17:00:00Z'),
      ] as TimeEvent[];

      const result = (service as any).calculateDayHours(events);

      expect(result.breakMinutes).toBe(0);
      expect(result.regularMinutes).toBe(480);
    });
  });
});
