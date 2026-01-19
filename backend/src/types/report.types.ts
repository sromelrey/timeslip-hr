export interface TimesheetExportRow {
  employeeId: number;
  employeeName: string;
  department: string;
  payPeriod: string;
  status: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  createdAt: Date;
}

export interface AttendanceSummaryRow {
  date: string;
  employeeId: number;
  employeeName: string;
  department: string;
  costCenter: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  breakDuration: number;
  anomalies: string; // comma-separated list
}

export enum AnomalyType {
  MISSING_CLOCK_OUT = 'Missing Clock Out',
  EXCESSIVE_HOURS = 'Excessive Hours (>12h)',
  NO_BREAK = 'No Break Recorded',
  DUPLICATE_ENTRY = 'Duplicate Entry',
}
