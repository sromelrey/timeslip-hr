export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum TimesheetStatus {
  DRAFT = 'DRAFT',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED',
}

export enum TimeEventType {
  CLOCK_IN = 'CLOCK_IN',
  CLOCK_OUT = 'CLOCK_OUT',
  BREAK_IN = 'BREAK_IN',
  BREAK_OUT = 'BREAK_OUT',
}

export enum TimeEventSource {
  KIOSK = 'KIOSK',
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

export enum TimesheetAnomalySeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum TimesheetAdjustmentField {
  REGULAR = 'REGULAR',
  BREAK = 'BREAK',
  OVERTIME = 'OVERTIME',
}

export enum TimesheetAdjustmentMode {
  DELTA = 'DELTA',
  OVERRIDE = 'OVERRIDE',
}

export enum PayslipItemType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

export enum PayslipStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED',
  VOID = 'VOID',
}

export enum PayPeriodStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum EmploymentType {
  HOURLY = 'HOURLY',
  SALARIED = 'SALARIED',
  DAILY = 'DAILY',
}

export enum CompensationType {
  HOURLY = 'HOURLY',
  SALARIED = 'SALARIED',
  DAILY = 'DAILY',
}
