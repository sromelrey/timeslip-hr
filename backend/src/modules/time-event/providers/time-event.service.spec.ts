/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TimeEventService } from './time-event.service';
import { TimeEvent } from '@/entities/time-event.entity';
import { Employee } from '@/entities/employee.entity';
import { TimeEventType, TimeEventSource } from '@/types/enums';
import * as argon2 from 'argon2';

// Mock argon2
jest.mock('argon2');

describe('TimeEventService', () => {
  let service: TimeEventService;
  let timeEventRepo: any;
  let employeeRepo: any;

  const mockEmployee: Partial<Employee> = {
    id: 1,
    employeeNumber: 1001001,
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    pinHash: null,
  };

  const mockTimeEvent: Partial<TimeEvent> = {
    id: 1,
    employeeId: 1,
    type: TimeEventType.CLOCK_IN,
    happenedAt: new Date(),
    source: TimeEventSource.KIOSK,
    requestId: 'test-request-id',
  };

  beforeEach(async () => {
    const mockTimeEventRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockEmployeeRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeEventService,
        { provide: getRepositoryToken(TimeEvent), useValue: mockTimeEventRepo },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    service = module.get<TimeEventService>(TimeEventService);
    timeEventRepo = module.get(getRepositoryToken(TimeEvent));
    employeeRepo = module.get(getRepositoryToken(Employee));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('State Machine - Valid Transitions', () => {
    it('should allow CLOCK_IN when status is CLOCKED_OUT', async () => {
      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne.mockResolvedValue(null); // No existing events
      timeEventRepo.create.mockReturnValue(mockTimeEvent);
      timeEventRepo.save.mockResolvedValue(mockTimeEvent);

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.CLOCK_IN,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-1',
      });

      expect(result).toBeDefined();
      expect(timeEventRepo.save).toHaveBeenCalled();
    });

    it('should allow BREAK_IN after CLOCK_IN', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.CLOCK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null) // No duplicate request
        .mockResolvedValueOnce(lastEvent); // Last event is CLOCK_IN
      timeEventRepo.create.mockReturnValue({ ...mockTimeEvent, type: TimeEventType.BREAK_IN });
      timeEventRepo.save.mockResolvedValue({ ...mockTimeEvent, type: TimeEventType.BREAK_IN });

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.BREAK_IN,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-2',
      });

      expect(result.type).toBe(TimeEventType.BREAK_IN);
    });

    it('should allow BREAK_OUT after BREAK_IN', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.BREAK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);
      timeEventRepo.create.mockReturnValue({ ...mockTimeEvent, type: TimeEventType.BREAK_OUT });
      timeEventRepo.save.mockResolvedValue({ ...mockTimeEvent, type: TimeEventType.BREAK_OUT });

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.BREAK_OUT,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-3',
      });

      expect(result.type).toBe(TimeEventType.BREAK_OUT);
    });

    it('should allow CLOCK_OUT after CLOCK_IN', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.CLOCK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);
      timeEventRepo.create.mockReturnValue({ ...mockTimeEvent, type: TimeEventType.CLOCK_OUT });
      timeEventRepo.save.mockResolvedValue({ ...mockTimeEvent, type: TimeEventType.CLOCK_OUT });

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.CLOCK_OUT,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-4',
      });

      expect(result.type).toBe(TimeEventType.CLOCK_OUT);
    });

    it('should allow CLOCK_OUT after BREAK_OUT', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.BREAK_OUT,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);
      timeEventRepo.create.mockReturnValue({ ...mockTimeEvent, type: TimeEventType.CLOCK_OUT });
      timeEventRepo.save.mockResolvedValue({ ...mockTimeEvent, type: TimeEventType.CLOCK_OUT });

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.CLOCK_OUT,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-5',
      });

      expect(result.type).toBe(TimeEventType.CLOCK_OUT);
    });
  });

  describe('State Machine - Invalid Transitions', () => {
    it('should reject double CLOCK_IN', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.CLOCK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-6',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject BREAK_OUT without BREAK_IN', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.CLOCK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.BREAK_OUT,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-7',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject CLOCK_OUT when already CLOCKED_OUT', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.CLOCK_OUT,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_OUT,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-8',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject BREAK_IN when on break', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.BREAK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.BREAK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-9',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject CLOCK_OUT while on break', async () => {
      const lastEvent: Partial<TimeEvent> = {
        ...mockTimeEvent,
        type: TimeEventType.BREAK_IN,
      };

      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(lastEvent);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_OUT,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-10',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Employee Validation', () => {
    it('should throw NotFoundException for unknown employee', async () => {
      employeeRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          employeeNumber: '9999999',
          type: TimeEventType.CLOCK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-11',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject inactive employee', async () => {
      const inactiveEmployee = { ...mockEmployee, isActive: false };
      employeeRepo.findOne.mockResolvedValue(inactiveEmployee);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-12',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PIN Validation', () => {
    it('should require PIN when employee has PIN set', async () => {
      const employeeWithPin = { ...mockEmployee, pinHash: 'hashed-pin' };
      employeeRepo.findOne.mockResolvedValue(employeeWithPin);
      timeEventRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-13',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate correct PIN', async () => {
      const employeeWithPin = { ...mockEmployee, pinHash: 'hashed-pin' };
      employeeRepo.findOne.mockResolvedValue(employeeWithPin);
      timeEventRepo.findOne.mockResolvedValue(null);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      timeEventRepo.create.mockReturnValue(mockTimeEvent);
      timeEventRepo.save.mockResolvedValue(mockTimeEvent);

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.CLOCK_IN,
        source: TimeEventSource.KIOSK,
        requestId: 'unique-request-14',
        pin: '1234',
      });

      expect(result).toBeDefined();
      expect(argon2.verify).toHaveBeenCalledWith('hashed-pin', '1234');
    });

    it('should reject invalid PIN', async () => {
      const employeeWithPin = { ...mockEmployee, pinHash: 'hashed-pin' };
      employeeRepo.findOne.mockResolvedValue(employeeWithPin);
      timeEventRepo.findOne.mockResolvedValue(null);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.create({
          employeeNumber: '1001001',
          type: TimeEventType.CLOCK_IN,
          source: TimeEventSource.KIOSK,
          requestId: 'unique-request-15',
          pin: 'wrong-pin',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Idempotency', () => {
    it('should return existing event for duplicate requestId', async () => {
      const existingEvent = { ...mockTimeEvent, id: 5 };
      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.findOne.mockResolvedValueOnce(existingEvent);

      const result = await service.create({
        employeeNumber: '1001001',
        type: TimeEventType.CLOCK_IN,
        source: TimeEventSource.KIOSK,
        requestId: 'existing-request-id',
      });

      expect(result.id).toBe(5);
      expect(timeEventRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentStatus', () => {
    it('should return CLOCKED_OUT when no events exist', async () => {
      timeEventRepo.findOne.mockResolvedValue(null);

      const status = await service.getCurrentStatus(1);

      expect(status).toBe('CLOCKED_OUT');
    });

    it('should return CLOCKED_OUT after CLOCK_OUT event', async () => {
      timeEventRepo.findOne.mockResolvedValue({
        type: TimeEventType.CLOCK_OUT,
      });

      const status = await service.getCurrentStatus(1);

      expect(status).toBe('CLOCKED_OUT');
    });

    it('should return CLOCK_IN when last event is CLOCK_IN', async () => {
      timeEventRepo.findOne.mockResolvedValue({
        type: TimeEventType.CLOCK_IN,
      });

      const status = await service.getCurrentStatus(1);

      expect(status).toBe(TimeEventType.CLOCK_IN);
    });

    it('should return BREAK_IN when on break', async () => {
      timeEventRepo.findOne.mockResolvedValue({
        type: TimeEventType.BREAK_IN,
      });

      const status = await service.getCurrentStatus(1);

      expect(status).toBe(TimeEventType.BREAK_IN);
    });
  });

  describe('getServerTime', () => {
    it('should return current server time', () => {
      const before = new Date();
      const result = service.getServerTime();
      const after = new Date();

      expect(result.serverTime).toBeInstanceOf(Date);
      expect(result.serverTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.serverTime.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('getRecentEvents', () => {
    it('should throw NotFoundException for unknown employee', async () => {
      employeeRepo.findOne.mockResolvedValue(null);

      await expect(service.getRecentEvents('9999999')).rejects.toThrow(NotFoundException);
    });

    it('should return recent events for valid employee', async () => {
      const events = [mockTimeEvent, { ...mockTimeEvent, id: 2 }];
      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.find.mockResolvedValue(events);

      const result = await service.getRecentEvents('1001001');

      expect(result).toHaveLength(2);
      expect(timeEventRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { employeeId: mockEmployee.id },
          take: 5,
        }),
      );
    });

    it('should respect custom limit', async () => {
      employeeRepo.findOne.mockResolvedValue(mockEmployee);
      timeEventRepo.find.mockResolvedValue([]);

      await service.getRecentEvents('1001001', 10);

      expect(timeEventRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });
  });
});
