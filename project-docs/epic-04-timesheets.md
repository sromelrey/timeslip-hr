# Epic 4: Timesheet Generation and Management (Admin-facing)

## Feature: Automated timesheet generation
- [x] Implement backend service to compute daily/weekly timesheets per employee
  - [x] Aggregate clock sessions and breaks into total worked hours per day
  - [x] Flag anomalies (missing clock-out, overlapping breaks, etc.)
- [x] Implement scheduled jobs (or on-demand generation per pay period)
  - [x] Add job retries and logging

## Feature: Timesheet review and correction workflow (Admin UI + API)
- [x] Build admin timesheet UI (filters by employee, date range, status)
  - [x] Show raw events and computed hours side-by-side
- [x] Implement timesheet adjustment capability
  - [x] Implement API for admin adjustments (with reason required)
  - [x] Track adjustment history (before/after values, reason, admin user)
  - [x] Lock rules (e.g., cannot edit after payslip generated unless reopened)

## Feature: Approvals and status management (optional but recommended)
- [x] Implement timesheet statuses (Draft → Reviewed → Approved → Locked)
  - [x] Implement API to change status with permission checks
  - [x] Add UI actions for review/approve/lock
