# Remaining Tasks to Implement

Based on the current project state and `TICKET.md`.

## 1. Employee Time Logging (Epic 3)
- [ ] **Employee Kiosk UI**: Build the interface for employees to clock in/out using their employee number/PIN.
- [ ] **Time Event API**: Verify/Implement logical validation for clock-in/out sequences (e.g., prevent double clock-in).
- [ ] **State Persistence**: Ensure server-side state (Clocked In vs. Clocked Out) is robust.

## 2. Timesheet Management (Epic 4)
- [ ] **Automated Generation**: Implement service to aggregate `TimeEvents` into daily `Timesheets`.
- [ ] **Admin Review UI**: Interface for admins to view, approve, or correct timesheets.
- [ ] **Adjustment Workflow**: API and UI for manual time adjustments.

## 3. Payroll & Payslips (Epic 5)
- [ ] **Payroll Calculation Engine**: Logic to compute gross pay (Hours * Rate) + deductibles.
- [ ] **Payslip Generation**: Generate finalized payslip records for a Pay Period.
- [ ] **PDF Export**: Generate PDF files for payslips.
- [ ] **Pay Period Management**: Admin UI to open/close pay periods.

## 4. Admin Dashboard (Epic 6)
- [ ] **Real-time Status**: Dashboard widget showing who is currently present/absent.
- [ ] **Attendance Reports**: Basic CSV export or summary view.

## 5. System Settings (Epic 7)
- [ ] **Configuration UI**: Manage company details, grace periods, and global rules.

## Recently Completed
- [x] Employee Core Entities & CRUD
- [x] Employee Compensation (Hourly/Salaried/Daily rates)
- [x] Authentication (JWT)
