# Epic 4: Timesheet Generation and Management (Admin-facing)

## Feature: Automated timesheet generation
- [ ] Implement backend service to compute daily/weekly timesheets per employee
  - [ ] Aggregate clock sessions and breaks into total worked hours per day
  - [ ] Flag anomalies (missing clock-out, overlapping breaks, etc.)
- [ ] Implement scheduled jobs (or on-demand generation per pay period)
  - [ ] Add job retries and logging

## Feature: Timesheet review and correction workflow (Admin UI + API)
- [ ] Build admin timesheet UI (filters by employee, date range, status)
  - [ ] Show raw events and computed hours side-by-side
- [ ] Implement timesheet adjustment capability
  - [ ] Implement API for admin adjustments (with reason required)
  - [ ] Track adjustment history (before/after values, reason, admin user)
  - [ ] Lock rules (e.g., cannot edit after payslip generated unless reopened)

## Feature: Approvals and status management (optional but recommended)
- [ ] Implement timesheet statuses (Draft → Reviewed → Approved → Locked)
  - [ ] Implement API to change status with permission checks
  - [ ] Add UI actions for review/approve/lock
