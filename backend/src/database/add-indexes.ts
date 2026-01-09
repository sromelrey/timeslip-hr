/**
 * Script to add performance indexes to the database.
 * Run with: npx ts-node -r tsconfig-paths/register src/database/add-indexes.ts
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const indexes = [
  // Time events: Latest status per employee (dashboard query)
  `CREATE INDEX IF NOT EXISTS idx_time_events_employee_happened 
   ON time_events(employee_id, happened_at DESC)`,

  // Timesheets: By pay period and status (approval workflow)
  `CREATE INDEX IF NOT EXISTS idx_timesheets_period_status 
   ON timesheets(pay_period_id, status)`,

  // Timesheets: By employee
  `CREATE INDEX IF NOT EXISTS idx_timesheets_employee 
   ON timesheets(employee_id)`,

  // Payslips: By pay period
  `CREATE INDEX IF NOT EXISTS idx_payslips_period 
   ON payslips(pay_period_id)`,

  // Payslips: By employee
  `CREATE INDEX IF NOT EXISTS idx_payslips_employee 
   ON payslips(employee_id)`,

  // Audit logs: By creation date (recent activity)
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_created 
   ON audit_logs(created_at DESC)`,

  // Audit logs: By user
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_user 
   ON audit_logs(user_id)`,

  // Employees: By company and active status
  `CREATE INDEX IF NOT EXISTS idx_employees_company_active 
   ON employees(company_id, is_active)`,

  // Employees: By employee number
  `CREATE INDEX IF NOT EXISTS idx_employees_number 
   ON employees(employee_number)`,

  // Time events: By happened_at
  `CREATE INDEX IF NOT EXISTS idx_time_events_happened_at 
   ON time_events(happened_at)`,

  // Pay periods: By company and dates
  `CREATE INDEX IF NOT EXISTS idx_pay_periods_company_dates 
   ON pay_periods(company_id, start_date, end_date)`,

  // Timesheet days: By timesheet and date
  `CREATE INDEX IF NOT EXISTS idx_timesheet_days_timesheet 
   ON timesheet_days(timesheet_id, date)`,
];

async function addIndexes() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected!\n');

  console.log('Adding performance indexes...\n');

  for (const indexSql of indexes) {
    const indexName = indexSql.match(/idx_\w+/)?.[0] || 'unknown';
    try {
      await dataSource.query(indexSql);
      console.log(`✅ Created: ${indexName}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`⚠️  Skipped ${indexName}: ${errorMessage}`);
    }
  }

  console.log('\nDone! Disconnecting...');
  await dataSource.destroy();
  console.log('Disconnected.');
}

addIndexes().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
