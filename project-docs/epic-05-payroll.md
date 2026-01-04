# Epic 5: Payroll Rules, Pay Periods, and Payslip Generation

## Feature: Pay period management
- [x] Implement pay period model and CRUD (semi-monthly/monthly configuration)
  - [x] Create admin UI to create/close pay periods
  - [x] Implement API endpoints for pay period management

## Feature: Payroll calculation engine
- [x] Implement payroll calculation using timesheet data
  - [x] Compute regular hours, break deductions, overtime (if configured), late/undertime (optional)
  - [x] Apply rounding rules (e.g., nearest minute/quarter-hour)
- [x] Implement earnings/deductions model (basic)
  - [x] Base hourly rate or salary basis per employee
  - [x] Configurable deductions/allowances (fixed or percentage, optional)

## Feature: Payslip generation (Admin)
- [x] Build admin payslip generation flow
  - [x] Generate payslips for selected employees and pay period
  - [x] Preview payslip before finalizing
- [x] Implement backend endpoints for payslip generation and retrieval
  - [x] Ensure deterministic recalculation rules (or store computed snapshot)
  - [x] Implement payslip versioning or “finalized” state

## Feature: Payslip export and distribution
- [x] Implement PDF generation for payslips
  - [x] Create payslip template (company info, employee info, period, breakdown)
- [x] Implement bulk export (ZIP of PDFs) for admins
- [x] Implement employee payslip viewing (optional)
  - [x] Employee portal page to view/download their payslips
