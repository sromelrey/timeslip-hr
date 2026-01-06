import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Employee } from '@/entities/employee.entity';
import { TimesheetExportDto } from '../dtos/timesheet-export.dto';
import { AttendanceSummaryDto } from '../dtos/attendance-summary.dto';
import { AnomalyType } from '@/types/report.types';
import { TimeEventType } from '@/types/enums';

// Simple CSV generation utility
function generateCSV(headers: string[], rows: any[][]): string {
  const escape = (field: string | number): string => {
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escape).join(',');
  const dataLines = rows.map((row) => row.map(escape).join(',')).join('\n');
  return `${headerLine}\n${dataLines}`;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(TimeEvent)
    private readonly timeEventRepo: Repository<TimeEvent>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async generateTimesheetExport(
    dto: TimesheetExportDto,
    companyId: number,
  ): Promise<string> {
    // Build query with filters
    const query = this.timesheetRepo
      .createQueryBuilder('t')
      .leftJoin('t.employee', 'e')
      .leftJoin('t.payPeriod', 'pp')
      .where('e.companyId = :companyId', { companyId })
      .select([
        'e.id as employeeId',
        "CONCAT(e.firstName, ' ', e.lastName) as employeeName",
        'e.department as department',
        "CONCAT(pp.startDate, ' - ', pp.endDate) as payPeriod",
        't.status as status',
        't.totalHours as totalHours',
        't.regularHours as regularHours',
        't.overtimeHours as overtimeHours',
        't.createdAt as createdAt',
      ]);

    // Apply optional filters
    if (dto.employeeId) {
      query.andWhere('e.id = :employeeId', { employeeId: dto.employeeId });
    }

    if (dto.departmentId) {
      // Department filter removed since department is a string column not a relation
      // Could filter by string: query.andWhere('e.department = :dept', { dept: deptName })
    }

    if (dto.costCenterId) {
      // Cost center not implemented in this schema
    }

    if (dto.payPeriodId) {
      query.andWhere('t.payPeriodId = :payPeriodId', {
        payPeriodId: dto.payPeriodId,
      });
    }

    if (dto.startDate && dto.endDate) {
      query.andWhere('pp.startDate >= :startDate', { startDate: dto.startDate });
      query.andWhere('pp.endDate <= :endDate', { endDate: dto.endDate });
    }

    if (dto.status) {
      query.andWhere('t.status = :status', { status: dto.status });
    }

    // Apply sorting
    const sortBy = dto.sortBy || 'employeeName';
    const sortOrder = dto.sortOrder || 'asc';
    const sortMap = {
      employeeName: 'employeeName',
      date: 'pp.startDate',
      totalHours: 't.totalHours',
    };
    query.orderBy(sortMap[sortBy], sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const results = await query.getRawMany();

    // Generate CSV using utility function
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Pay Period',
      'Status',
      'Total Hours',
      'Regular Hours',
      'Overtime Hours',
      'Created At',
    ];

    const rows = results.map((record) => [
      record.employeeId,
      record.employeeName,
      record.department || 'N/A',
      record.payPeriod,
      record.status,
      Number(record.totalHours || 0).toFixed(2),
      Number(record.regularHours || 0).toFixed(2),
      Number(record.overtimeHours || 0).toFixed(2),
      record.createdAt
        ? new Date(record.createdAt).toISOString().split('T')[0]
        : 'N/A',
    ]);

    return generateCSV(headers, rows);
  }

  async generateAttendanceSummary(
    dto: AttendanceSummaryDto,
    companyId: number,
  ): Promise<string> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Get all employees matching filter criteria
    const employeesQuery = this.employeeRepo
      .createQueryBuilder('e')
      .where('e.companyId = :companyId', { companyId })
      .andWhere('e.isActive = :isActive', { isActive: true })
      .select([
        'e.id as employeeId',
        "CONCAT(e.firstName, ' ', e.lastName) as employeeName",
        'e.department as department',
      ]);

    if (dto.departmentId) {
      // Department filter not implemented (string column)
    }

    if (dto.costCenterId) {
      // Cost center not implemented
    }

    const employees = await employeesQuery.getRawMany();

    // For each employee and date, calculate attendance
    const summary: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      for (const emp of employees) {
        // Get time events for this employee on this day
        const events = await this.timeEventRepo
          .createQueryBuilder('te')
          .where('te.employeeId = :employeeId', { employeeId: emp.employeeId })
          .andWhere('te.happenedAt BETWEEN :start AND :end', {
            start: dayStart,
            end: dayEnd,
          })
          .orderBy('te.happenedAt', 'ASC')
          .getMany();

        const clockIn = events.find((e) => e.type === TimeEventType.CLOCK_IN);
        const clockOut = events.find((e) => e.type === TimeEventType.CLOCK_OUT);
        const breakEvents = events.filter(
          (e) =>
            e.type === TimeEventType.BREAK_IN ||
            e.type === TimeEventType.BREAK_OUT,
        );

        // Calculate total hours and break duration
        let totalHours = 0;
        let breakDuration = 0;
        const anomalies: string[] = [];

        if (clockIn) {
          if (clockOut) {
            const diff =
              clockOut.happenedAt.getTime() - clockIn.happenedAt.getTime();
            totalHours = diff / (1000 * 60 * 60); // Convert to hours

            // Check for excessive hours
            if (totalHours > 12) {
              anomalies.push(AnomalyType.EXCESSIVE_HOURS);
            }
          } else {
            anomalies.push(AnomalyType.MISSING_CLOCK_OUT);
          }

          // Calculate break duration
          for (let i = 0; i < breakEvents.length; i += 2) {
            const breakStart = breakEvents[i];
            const breakEnd = breakEvents[i + 1];
            if (
              breakStart &&
              breakEnd &&
              breakStart.type === TimeEventType.BREAK_IN &&
              breakEnd.type === TimeEventType.BREAK_OUT
            ) {
              const breakDiff =
                breakEnd.happenedAt.getTime() - breakStart.happenedAt.getTime();
              breakDuration += breakDiff / (1000 * 60 * 60);
            }
          }

          // Check for no break
          if (totalHours > 6 && breakDuration === 0) {
            anomalies.push(AnomalyType.NO_BREAK);
          }
        }

        // Only include if there was activity or anomalies
        if (clockIn || anomalies.length > 0) {
          summary.push({
            date: currentDate.toISOString().split('T')[0],
            employeeId: emp.employeeId,
            employeeName: emp.employeeName,
            department: emp.department || 'N/A',
            clockIn: clockIn
              ? clockIn.happenedAt.toISOString().split('T')[1].substring(0, 8)
              : 'N/A',
            clockOut: clockOut
              ? clockOut.happenedAt.toISOString().split('T')[1].substring(0, 8)
              : 'N/A',
            totalHours: totalHours.toFixed(2),
            breakDuration: breakDuration.toFixed(2),
            anomalies: anomalies.join(', '),
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Apply sorting
    const sortOrder = dto.sortOrder || 'asc';
    summary.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Filter by anomalies if requested
    const filteredSummary =
      dto.includeAnomalies === false
        ? summary.filter((row) => !row.anomalies)
        : summary;

    // Generate CSV using utility function
    const headers = [
      'Date',
      'Employee ID',
      'Employee Name',
      'Department',
      'Clock In',
      'Clock Out',
      'Total Hours',
      'Break Duration',
      'Anomalies',
    ];

    const rows = filteredSummary.map((record) => [
      record.date,
      record.employeeId,
      record.employeeName,
      record.department,
      record.clockIn,
      record.clockOut,
      record.totalHours,
      record.breakDuration,
      record.anomalies,
    ]);

    return generateCSV(headers, rows);
  }
}
