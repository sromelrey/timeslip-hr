import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Employee } from '@/entities/employee.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { Payslip } from '@/entities/payslip.entity';
import { DashboardStats } from '@/types/dashboard.types';
import { TimesheetStatus, PayslipStatus, TimeEventType } from '@/types/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(TimeEvent)
    private readonly timeEventRepo: Repository<TimeEvent>,
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(Payslip)
    private readonly payslipRepo: Repository<Payslip>,
  ) {}

  async getStats(companyId: number): Promise<DashboardStats> {
    // Get total active employees
    const totalEmployees = await this.employeeRepo.count({
      where: { companyId, isActive: true },
    });

    // Get today's attendance
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count unique employees who clocked in today
    const clockedInToday = await this.timeEventRepo
      .createQueryBuilder('te')
      .leftJoin('te.employee', 'employee')
      .where('employee.companyId = :companyId', { companyId })
      .andWhere('te.type = :eventType', { eventType: TimeEventType.CLOCK_IN })
      .andWhere('te.happenedAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .select('COUNT(DISTINCT te.employeeId)', 'count')
      .getRawOne();

    const present = parseInt(clockedInToday?.count || '0', 10);
    const attendancePercentage = totalEmployees > 0 
      ? Math.round((present / totalEmployees) * 100) 
      : 0;

    // Get currently clocked in employees (who have CLOCK_IN without matching CLOCK_OUT today)
    const currentlyClockedInResult = await this.timeEventRepo
      .createQueryBuilder('te')
      .leftJoin('te.employee', 'employee')
      .where('employee.companyId = :companyId', { companyId })
      .andWhere('employee.isActive = :isActive', { isActive: true })
      .andWhere('te.type = :clockIn', { clockIn: TimeEventType.CLOCK_IN })
      .andWhere('te.happenedAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TimeEvent, 'te_out')
          .where('te_out.employeeId = te.employeeId')
          .andWhere('te_out.type = :clockOut', { clockOut: TimeEventType.CLOCK_OUT })
          .andWhere('te_out.happenedAt > te.happenedAt')
          .andWhere('te_out.happenedAt BETWEEN :start AND :end')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      })
      .select('COUNT(DISTINCT te.employeeId)', 'count')
      .getRawOne();

    const currentlyClockedIn = parseInt(currentlyClockedInResult?.count || '0', 10);

    // Get employees currently on break (BREAK_IN without matching BREAK_OUT)
    const onBreakResult = await this.timeEventRepo
      .createQueryBuilder('te')
      .leftJoin('te.employee', 'employee')
      .where('employee.companyId = :companyId', { companyId })
      .andWhere('employee.isActive = :isActive', { isActive: true })
      .andWhere('te.type = :breakIn', { breakIn: TimeEventType.BREAK_IN })
      .andWhere('te.happenedAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TimeEvent, 'te_end')
          .where('te_end.employeeId = te.employeeId')
          .andWhere('te_end.type = :breakOut', { breakOut: TimeEventType.BREAK_OUT })
          .andWhere('te_end.happenedAt > te.happenedAt')
          .andWhere('te_end.happenedAt BETWEEN :start AND :end')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      })
      .select('COUNT(DISTINCT te.employeeId)', 'count')
      .getRawOne();

    const onBreak = parseInt(onBreakResult?.count || '0', 10);

    // Get recent activity (last 10 time events with employee names)
    const recentActivityRaw = await this.timeEventRepo
      .createQueryBuilder('te')
      .leftJoin('te.employee', 'employee')
      .where('employee.companyId = :companyId', { companyId })
      .select([
        'te.id as id',
        'te.type as eventType',
        'te.happenedAt as timestamp',
        "CONCAT(employee.firstName, ' ', employee.lastName) as employeeName",
      ])
      .orderBy('te.happenedAt', 'DESC')
      .limit(10)
      .getRawMany();

    const recentActivity = recentActivityRaw.map((record) => ({
      id: record.id,
      employeeName: record.employeeName,
      eventType: record.eventType,
      timestamp: record.timestamp,
    }));

    // Get pending timesheet approvals (DRAFT or REVIEWED status)
    const pendingTimesheets = await this.timesheetRepo.count({
      where: [
        { employee: { companyId }, status: TimesheetStatus.DRAFT },
        { employee: { companyId }, status: TimesheetStatus.REVIEWED },
      ],
    });

    // Get pending payslip finalizations (DRAFT status)
    const pendingPayslips = await this.payslipRepo.count({
      where: {
        employee: { companyId },
        status: PayslipStatus.DRAFT,
      },
    });

    return {
      totalEmployees,
      attendanceToday: {
        present,
        total: totalEmployees,
        percentage: attendancePercentage,
      },
      pendingApprovals: {
        timesheets: pendingTimesheets,
        payslips: pendingPayslips,
      },
      currentlyClockedIn,
      onBreak,
      recentActivity,
    };
  }

  async getCurrentlyActive(companyId: number) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Get employees currently clocked in with details
    const activeEmployees = await this.timeEventRepo
      .createQueryBuilder('te')
      .leftJoin('te.employee', 'employee')
      .leftJoin('employee.department', 'department')
      .where('employee.companyId = :companyId', { companyId })
      .andWhere('employee.isActive = :isActive', { isActive: true })
      .andWhere('te.type = :clockIn', { clockIn: TimeEventType.CLOCK_IN })
      .andWhere('te.happenedAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TimeEvent, 'te_out')
          .where('te_out.employeeId = te.employeeId')
          .andWhere('te_out.type = :clockOut', { clockOut: TimeEventType.CLOCK_OUT })
          .andWhere('te_out.happenedAt > te.happenedAt')
          .andWhere('te_out.happenedAt BETWEEN :start AND :end')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      })
      .select([
        'employee.id as id',
        "CONCAT(employee.firstName, ' ', employee.lastName) as name",
        'department.name as department',
        'te.happenedAt as clockedInAt',
      ])
      .getRawMany();

    // Check if each employee is on break
    const result = await Promise.all(
      activeEmployees.map(async (emp) => {
        const onBreak = await this.timeEventRepo
          .createQueryBuilder('te')
          .where('te.employeeId = :employeeId', { employeeId: emp.id })
          .andWhere('te.type = :breakIn', { breakIn: TimeEventType.BREAK_IN })
          .andWhere('te.happenedAt BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
          })
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('1')
              .from(TimeEvent, 'te_end')
              .where('te_end.employeeId = te.employeeId')
              .andWhere('te_end.type = :breakOut', { breakOut: TimeEventType.BREAK_OUT })
              .andWhere('te_end.happenedAt > te.happenedAt')
              .andWhere('te_end.happenedAt BETWEEN :start AND :end')
              .getQuery();
            return 'NOT EXISTS ' + subQuery;
          })
          .getCount();

        return {
          id: emp.id,
          name: emp.name,
          department: emp.department || 'Unassigned',
          clockedInAt: emp.clockedInAt,
          status: (onBreak > 0 ? 'ON_BREAK' : 'ACTIVE') as 'ACTIVE' | 'ON_BREAK',
        };
      })
    );

    return result;
  }
}
