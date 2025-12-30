import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Timesheet } from '../../entities/timesheet.entity';
import { TimesheetDay } from '../../entities/timesheet-day.entity';
import { TimesheetAdjustment } from '../../entities/timesheet-adjustment.entity';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Employee } from '../../entities/employee.entity';
import { TimeEvent } from '../../entities/time-event.entity';
import { TimesheetStatus, TimeEventType, TimesheetAdjustmentField, TimesheetAdjustmentMode } from '@/types/enums';
import { CreateAdjustmentDto } from './dtos/create-adjustment.dto';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(TimesheetDay)
    private readonly timesheetDayRepo: Repository<TimesheetDay>,
    @InjectRepository(TimesheetAdjustment)
    private readonly adjustmentRepo: Repository<TimesheetAdjustment>,
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(TimeEvent)
    private readonly timeEventRepo: Repository<TimeEvent>,
  ) {}

  async findAll(companyId: number): Promise<Timesheet[]> {
    return this.timesheetRepo.find({
      where: { payPeriod: { companyId } },
      relations: ['employee', 'payPeriod'],
      order: { payPeriod: { startDate: 'DESC' }, employee: { lastName: 'ASC' } },
    });
  }

  async getPayPeriods(companyId: number): Promise<PayPeriod[]> {
    return this.payPeriodRepo.find({
      where: { companyId },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, companyId: number): Promise<Timesheet> {
    const timesheet = await this.timesheetRepo.findOne({
      where: { id, payPeriod: { companyId } },
      relations: ['employee', 'payPeriod', 'days'],
      order: { days: { workDate: 'ASC' } }, 
    });
    if (!timesheet) {
      throw new NotFoundException(`Timesheet #${id} not found`);
    }
    return timesheet;
  }

  // Generate timesheets for a pay period if they don't exist
  async generateForPeriod(companyId: number, payPeriodId: number): Promise<Timesheet[]> {
    const payPeriod = await this.payPeriodRepo.findOneBy({ id: payPeriodId, companyId });
    if (!payPeriod) {
      throw new NotFoundException('PayPeriod not found');
    }

    const employees = await this.employeeRepo.find({ where: { companyId, isActive: true } });
    const createdTimesheets: Timesheet[] = [];

    for (const employee of employees) {
      // Check if exists
      const existing = await this.timesheetRepo.findOneBy({
        employeeId: employee.id,
        payPeriodId: payPeriod.id,
      });

      if (!existing) {
        const newTimesheet = this.timesheetRepo.create({
          employeeId: employee.id,
          payPeriodId: payPeriod.id,
          status: TimesheetStatus.DRAFT,
        });
        await this.timesheetRepo.save(newTimesheet);
        createdTimesheets.push(newTimesheet);
      }
    }

    return createdTimesheets;
  }

  /**
   * Populate TimesheetDay records by aggregating TimeEvent data.
   */
  async populateDaysForTimesheet(timesheetId: number, companyId: number): Promise<TimesheetDay[]> {
    const timesheet = await this.timesheetRepo.findOne({
      where: { id: timesheetId, payPeriod: { companyId } },
      relations: ['payPeriod'],
    });
    if (!timesheet) {
      throw new NotFoundException(`Timesheet #${timesheetId} not found`);
    }
    if (timesheet.status !== TimesheetStatus.DRAFT) {
      throw new BadRequestException('Can only populate days for DRAFT timesheets');
    }

    const { startDate, endDate } = timesheet.payPeriod;
    const events = await this.timeEventRepo.find({
      where: {
        employeeId: timesheet.employeeId,
        happenedAt: Between(new Date(startDate), new Date(new Date(endDate).getTime() + 86400000)), // Include end day
      },
      order: { happenedAt: 'ASC' },
    });

    // Group events by date
    const eventsByDate = new Map<string, TimeEvent[]>();
    for (const event of events) {
      const dateKey = event.happenedAt.toISOString().split('T')[0];
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    }

    const createdDays: TimesheetDay[] = [];

    for (const [dateKey, dayEvents] of eventsByDate) {
      const { regularMinutes, breakMinutes, anomalies } = this.calculateDayHours(dayEvents);

      // Upsert TimesheetDay
      let day = await this.timesheetDayRepo.findOneBy({ timesheetId, workDate: dateKey });
      if (!day) {
        day = this.timesheetDayRepo.create({
          timesheetId,
          workDate: dateKey,
        });
      }
      day.regularMinutes = regularMinutes;
      day.breakMinutes = breakMinutes;
      day.anomaliesJson = anomalies.length > 0 ? JSON.stringify(anomalies) : null;
      await this.timesheetDayRepo.save(day);
      createdDays.push(day);
    }

    // Update generated timestamp
    timesheet.generatedAt = new Date();
    await this.timesheetRepo.save(timesheet);

    return createdDays;
  }

  /**
   * Calculate work and break minutes from a day's events.
   */
  private calculateDayHours(events: TimeEvent[]): { regularMinutes: number; breakMinutes: number; anomalies: string[] } {
    let regularMinutes = 0;
    let breakMinutes = 0;
    const anomalies: string[] = [];

    let clockInTime: Date | null = null;
    let breakInTime: Date | null = null;

    for (const event of events) {
      switch (event.type) {
        case TimeEventType.CLOCK_IN:
          if (clockInTime) {
            anomalies.push(`Double CLOCK_IN at ${event.happenedAt.toISOString()}`);
          }
          clockInTime = event.happenedAt;
          break;

        case TimeEventType.CLOCK_OUT:
          if (!clockInTime) {
            anomalies.push(`CLOCK_OUT without CLOCK_IN at ${event.happenedAt.toISOString()}`);
          } else {
            regularMinutes += Math.floor((event.happenedAt.getTime() - clockInTime.getTime()) / 60000);
            clockInTime = null;
          }
          break;

        case TimeEventType.BREAK_IN:
          if (breakInTime) {
            anomalies.push(`Double BREAK_IN at ${event.happenedAt.toISOString()}`);
          }
          breakInTime = event.happenedAt;
          break;

        case TimeEventType.BREAK_OUT:
          if (!breakInTime) {
            anomalies.push(`BREAK_OUT without BREAK_IN at ${event.happenedAt.toISOString()}`);
          } else {
            breakMinutes += Math.floor((event.happenedAt.getTime() - breakInTime.getTime()) / 60000);
            breakInTime = null;
          }
          break;
      }
    }

    // Check for unclosed sessions
    if (clockInTime) {
      anomalies.push(`Missing CLOCK_OUT (open since ${clockInTime.toISOString()})`);
    }
    if (breakInTime) {
      anomalies.push(`Missing BREAK_OUT (started at ${breakInTime.toISOString()})`);
    }

    // Subtract break time from regular time
    regularMinutes = Math.max(0, regularMinutes - breakMinutes);

    return { regularMinutes, breakMinutes, anomalies };
  }

  /**
   * Update timesheet status (Admin workflow).
   */
  async updateStatus(id: number, newStatus: TimesheetStatus, userId: number, companyId: number): Promise<Timesheet> {
    const timesheet = await this.findOne(id, companyId);

    const now = new Date();
    switch (newStatus) {
      case TimesheetStatus.REVIEWED:
        timesheet.reviewedAt = now;
        timesheet.reviewedByUserId = userId;
        break;
      case TimesheetStatus.APPROVED:
        timesheet.approvedAt = now;
        timesheet.approvedByUserId = userId;
        break;
      case TimesheetStatus.LOCKED:
        timesheet.lockedAt = now;
        timesheet.lockedByUserId = userId;
        break;
    }
    timesheet.status = newStatus;

    return this.timesheetRepo.save(timesheet);
  }

  /**
   * Create a manual adjustment for a timesheet day.
   */
  async createAdjustment(
    dayId: number,
    dto: CreateAdjustmentDto,
    userId: number,
    companyId: number,
  ): Promise<TimesheetAdjustment> {
    // Find the day and verify ownership via timesheet -> pay period -> company
    const day = await this.timesheetDayRepo.findOne({
      where: { id: dayId },
      relations: ['timesheet', 'timesheet.payPeriod'],
    });
    if (!day || !day.timesheet?.payPeriod || day.timesheet.payPeriod.companyId !== companyId) {
      throw new NotFoundException(`Timesheet day #${dayId} not found`);
    }

    // Prevent adjustments on locked timesheets
    if (day.timesheet.status === TimesheetStatus.LOCKED) {
      throw new BadRequestException('Cannot adjust a locked timesheet');
    }

    // Create the adjustment record
    const adjustment = this.adjustmentRepo.create({
      timesheetDayId: dayId,
      field: dto.field,
      mode: dto.mode,
      deltaMinutes: dto.mode === TimesheetAdjustmentMode.DELTA ? dto.deltaMinutes : null,
      overrideMinutes: dto.mode === TimesheetAdjustmentMode.OVERRIDE ? dto.overrideMinutes : null,
      reason: dto.reason,
      createdByUserId: userId,
    });
    await this.adjustmentRepo.save(adjustment);

    // Apply adjustment to the day's values
    const fieldMap: Record<TimesheetAdjustmentField, keyof Pick<TimesheetDay, 'regularMinutes' | 'breakMinutes' | 'overtimeMinutes'>> = {
      [TimesheetAdjustmentField.REGULAR]: 'regularMinutes',
      [TimesheetAdjustmentField.BREAK]: 'breakMinutes',
      [TimesheetAdjustmentField.OVERTIME]: 'overtimeMinutes',
    };
    const targetField = fieldMap[dto.field];

    if (dto.mode === TimesheetAdjustmentMode.DELTA) {
      day[targetField] = Math.max(0, day[targetField] + (dto.deltaMinutes ?? 0));
    } else {
      day[targetField] = dto.overrideMinutes ?? 0;
    }
    await this.timesheetDayRepo.save(day);

    return adjustment;
  }

  /**
   * Get adjustment history for a specific day.
   */
  async getAdjustmentsForDay(dayId: number, companyId: number): Promise<TimesheetAdjustment[]> {
    const day = await this.timesheetDayRepo.findOne({
      where: { id: dayId },
      relations: ['timesheet', 'timesheet.payPeriod'],
    });
    if (!day || day.timesheet.payPeriod.companyId !== companyId) {
      throw new NotFoundException(`Timesheet day #${dayId} not found`);
    }

    return this.adjustmentRepo.find({
      where: { timesheetDayId: dayId },
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get raw time events for a timesheet (for side-by-side comparison).
   */
  async getRawEventsForTimesheet(timesheetId: number, companyId: number): Promise<TimeEvent[]> {
    const timesheet = await this.timesheetRepo.findOne({
      where: { id: timesheetId, payPeriod: { companyId } },
      relations: ['payPeriod'],
    });
    if (!timesheet) {
      throw new NotFoundException(`Timesheet #${timesheetId} not found`);
    }

    const { startDate, endDate } = timesheet.payPeriod;
    return this.timeEventRepo.find({
      where: {
        employeeId: timesheet.employeeId,
        happenedAt: Between(new Date(startDate), new Date(new Date(endDate).getTime() + 86400000)),
      },
      order: { happenedAt: 'ASC' },
    });
  }
}

