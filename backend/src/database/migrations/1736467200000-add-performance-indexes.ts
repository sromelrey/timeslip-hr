import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to add performance indexes for high-traffic queries.
 * These indexes optimize:
 * - Dashboard statistics (employee status, time events)
 * - Timesheet and payslip listings
 * - Audit log browsing
 */
export class AddPerformanceIndexes1736467200000 implements MigrationInterface {
  name = 'AddPerformanceIndexes1736467200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Index for fetching latest time event per employee (dashboard query)
    // Used by: DashboardService.getStats() - finding who is currently clocked in
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_events_employee_happened 
      ON time_events(employee_id, happened_at DESC);
    `);

    // Index for filtering timesheets by pay period and status
    // Used by: TimesheetService.findAll(), timesheet approval workflow
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_timesheets_period_status 
      ON timesheets(pay_period_id, status);
    `);

    // Index for fetching timesheets by employee
    // Used by: Employee timesheet history, payslip generation
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_timesheets_employee 
      ON timesheets(employee_id);
    `);

    // Index for filtering payslips by pay period
    // Used by: PayslipService.findAll(), bulk export
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payslips_period 
      ON payslips(pay_period_id);
    `);

    // Index for fetching payslips by employee
    // Used by: Employee portal "My Payslips"
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payslips_employee 
      ON payslips(employee_id);
    `);

    // Index for audit logs by creation date (recent activity)
    // Used by: AuditService.getRecentLogs()
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created 
      ON audit_logs(created_at DESC);
    `);

    // Index for audit logs by user (admin action history)
    // Used by: Filtering audit logs by admin user
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user 
      ON audit_logs(user_id);
    `);

    // Index for employees by company and active status
    // Used by: Employee listings, dashboard stats
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employees_company_active 
      ON employees(company_id, is_active);
    `);

    // Index for employees by employee number (login/kiosk lookup)
    // Used by: TimeEventService.create() - employee lookup by number
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employees_number 
      ON employees(employee_number);
    `);

    // Index for time events by date range (timesheet generation)
    // Used by: Aggregating events for a pay period
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_events_happened_at 
      ON time_events(happened_at);
    `);

    // Index for pay periods by company and date range
    // Used by: Finding current/active pay periods
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_pay_periods_company_dates 
      ON pay_periods(company_id, start_date, end_date);
    `);

    // Index for timesheet days by timesheet and date
    // Used by: Viewing daily breakdown in timesheet details
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_timesheet_days_timesheet 
      ON timesheet_days(timesheet_id, date);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes in reverse order
    await queryRunner.query(`DROP INDEX IF EXISTS idx_timesheet_days_timesheet;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_pay_periods_company_dates;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_time_events_happened_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employees_number;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employees_company_active;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_audit_logs_user;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_audit_logs_created;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_payslips_employee;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_payslips_period;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_timesheets_employee;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_timesheets_period_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_time_events_employee_happened;`);
  }
}
