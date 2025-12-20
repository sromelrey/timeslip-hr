# Epic 5: Payroll Rules, Pay Periods, and Payslip Generation

## Feature: Pay period management
- [ ] Implement pay period model and CRUD (semi-monthly/monthly configuration)
  - [ ] Create admin UI to create/close pay periods
  - [ ] Implement API endpoints for pay period management

## Feature: Payroll calculation engine
- [ ] Implement payroll calculation using timesheet data
  - [ ] Compute regular hours, break deductions, overtime (if configured), late/undertime (optional)
  - [ ] Apply rounding rules (e.g., nearest minute/quarter-hour)
- [ ] Implement earnings/deductions model (basic)
  - [ ] Base hourly rate or salary basis per employee
  - [ ] Configurable deductions/allowances (fixed or percentage, optional)

## Feature: Payslip generation (Admin)
- [ ] Build admin payslip generation flow
  - [ ] Generate payslips for selected employees and pay period
  - [ ] Preview payslip before finalizing
- [ ] Implement backend endpoints for payslip generation and retrieval
  - [ ] Ensure deterministic recalculation rules (or store computed snapshot)
  - [ ] Implement payslip versioning or “finalized” state

## Feature: Payslip export and distribution
- [ ] Implement PDF generation for payslips
  - [ ] Create payslip template (company info, employee info, period, breakdown)
- [ ] Implement bulk export (ZIP of PDFs) for admins
- [ ] Implement employee payslip viewing (optional)
  - [ ] Employee portal page to view/download their payslips
