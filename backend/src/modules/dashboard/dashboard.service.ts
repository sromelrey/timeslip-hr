import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '@/entities/employee.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { Payslip } from '@/entities/payslip.entity';
import { DashboardStats, RecentActivityItem } from '@/types/dashboard.types';
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

    // Get current activity status
    const latestEvents = await this.timeEventRepo
      .createQueryBuilder('te')
      .innerJoin(
        qb => qb
          .select('max(happened_at)', 'max_happened_at')
          .addSelect('employee_id', 'inner_employee_id')
          .from(TimeEvent, 'inner_te')
          .groupBy('employee_id'),
        'latest',
        'te.employee_id = latest.inner_employee_id AND te.happened_at = latest.max_happened_at'
      )
      .leftJoinAndSelect('te.employee', 'employee')
      .where('employee.companyId = :companyId', { companyId })
      .getMany();

    const currentlyClockedIn = latestEvents.filter(e => 
      e.type === TimeEventType.CLOCK_IN || e.type === TimeEventType.BREAK_OUT
    ).length;

    const onBreak = latestEvents.filter(e => 
      e.type === TimeEventType.BREAK_IN
    ).length;

    // Get recent activity
    const recentEvents = await this.timeEventRepo.find({
      where: { employee: { companyId } },
      relations: ['employee'],
      order: { happenedAt: 'DESC' },
      take: 5,
    });

    const recentActivity: RecentActivityItem[] = recentEvents.map(event => ({
      id: event.id,
      employeeName: event.employee.firstName + ' ' + event.employee.lastName,
      eventType: event.type,
      timestamp: event.happenedAt,
    }));

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
}
