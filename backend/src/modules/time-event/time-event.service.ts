import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { TimeEvent } from '@/entities/time-event.entity';
import { Employee } from '@/entities/employee.entity';
import { TimeEventType } from '@/types/enums';
import { CreateTimeEventDto } from './dtos';

@Injectable()
export class TimeEventService {
  constructor(
    @InjectRepository(TimeEvent)
    private readonly timeEventRepo: Repository<TimeEvent>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateTimeEventDto, ipAddress?: string): Promise<TimeEvent> {
    const employee = await this.employeeRepo.findOne({
      where: { employeeNumber: parseInt(dto.employeeNumber) },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with number ${dto.employeeNumber} not found`);
    }

    if (!employee.isActive) {
        throw new BadRequestException('Employee account is inactive');
    }

    // Validate PIN if provided or required
    if (dto.pin) {
      if (!employee.pinHash) {
        throw new BadRequestException('Employee has no PIN set. Please contact admin.');
      }
      const isPinValid = await argon2.verify(employee.pinHash, dto.pin);
      if (!isPinValid) {
        throw new BadRequestException('Invalid PIN');
      }
    }

    // Check for idempotency
    const existingEvent = await this.timeEventRepo.findOne({
      where: { requestId: dto.requestId },
    });
    if (existingEvent) {
      return existingEvent;
    }

    // Validate State Transition
    const currentState = await this.getCurrentStatus(employee.id);
    this.validateTransition(currentState, dto.type);

    // Create Event
    const timeEvent = this.timeEventRepo.create({
      employeeId: employee.id,
      type: dto.type,
      happenedAt: new Date(), // Server authoritative time
      source: dto.source,
      requestId: dto.requestId,
      deviceId: dto.deviceId,
      ipAddress: ipAddress,
      metaJson: dto.metaJson,
    });

    return this.timeEventRepo.save(timeEvent);
  }

  async getCurrentStatus(employeeId: number): Promise<TimeEventType | 'CLOCKED_OUT'> {
    const lastEvent = await this.timeEventRepo.findOne({
      where: { employeeId },
      order: { happenedAt: 'DESC' },
    });

    if (!lastEvent) {
      return 'CLOCKED_OUT';
    }

    // Mapping event type to status
    if (lastEvent.type === TimeEventType.CLOCK_OUT) {
        return 'CLOCKED_OUT';
    }

    return lastEvent.type;
  }

  private validateTransition(currentState: TimeEventType | 'CLOCKED_OUT', eventType: TimeEventType): void {
    const validTransitions: Record<string, TimeEventType[]> = {
      'CLOCKED_OUT': [TimeEventType.CLOCK_IN],
      [TimeEventType.CLOCK_IN]: [TimeEventType.CLOCK_OUT, TimeEventType.BREAK_IN],
      [TimeEventType.BREAK_IN]: [TimeEventType.BREAK_OUT],
      [TimeEventType.BREAK_OUT]: [TimeEventType.CLOCK_OUT, TimeEventType.BREAK_IN],
    };

    const allowedEvents = validTransitions[currentState] || [];
    if (!allowedEvents.includes(eventType)) {
      throw new BadRequestException(
        `Invalid transition: Cannot perform ${eventType} when current status is ${currentState}`,
      );
    }
  }

  async getRecentEvents(employeeNumber: string, limit: number = 5): Promise<TimeEvent[]> {
    const employee = await this.employeeRepo.findOne({
        where: { employeeNumber: parseInt(employeeNumber) },
    });
    
    if (!employee) {
        throw new NotFoundException(`Employee with number ${employeeNumber} not found`);
    }

    return this.timeEventRepo.find({
      where: { employeeId: employee.id },
      order: { happenedAt: 'DESC' },
      take: limit,
    });
  }

  async getStatusByNumber(employeeNumber: string): Promise<{ status: TimeEventType | 'CLOCKED_OUT' }> {
    const employee = await this.employeeRepo.findOne({
        where: { employeeNumber: parseInt(employeeNumber) },
    });
    
    if (!employee) {
        throw new NotFoundException(`Employee with number ${employeeNumber} not found`);
    }

    const status = await this.getCurrentStatus(employee.id);
    return { status };
  }

  getServerTime(): { serverTime: Date } {
    return { serverTime: new Date() };
  }
}
