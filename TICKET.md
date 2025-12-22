# Mini HRIS — Work Breakdown Structure (WBS)

## Epic 1: Foundations, Architecture, and DevOps

### Feature: Define core domain model and business rules
- [x] Define core entities and relationships (Employee, Admin/User, TimeLog, Timesheet, PayPeriod, Payslip, Settings)
  - [x] Document TimeLog state machine (Clocked Out → Clocked In → Break In/Out → Clock Out)
  - [x] Define validation rules (no overlapping sessions, required sequences, idempotency on submissions)
- [x] Define pay and time computation rules (rounding, grace periods, overtime rules if any)
  - [x] Specify how break time impacts paid hours (paid/unpaid breaks)

### Feature: Set up backend scaffolding
- [x] Initialize backend project (API routing, config, validation, error handling)
- [x] Set up database schema and migrations
  - [x] Create tables for users/employees, time logs, pay periods, payslips, settings
- [x] Implement shared utilities (date/time helpers, money helpers, audit logging)

### Feature: Set up frontend scaffolding
- [x] Initialize frontend project (routing, layouts, state management, UI kit)
- [x] Implement role-based routing guards (Employee vs Admin)

### Feature: CI/CD and basic observability
- [x] Configure CI pipeline (lint, tests, build)
- [x] Configure deployment pipeline (staging/prod)
- [x] Implement basic logging/monitoring hooks (API request logs, error boundaries)

---

## Epic 2: Authentication, Authorization, and User Management

### Feature: Authentication (Employee + Admin)
- [/] Implement login flow for employees using Employee Number + optional PIN
  - [x] Create employee login UI
  - [/] Implement API endpoint for employee authentication
  - [ ] Implement session/token storage and renewal
- [x] Implement admin login (email/username + password)
  - [x] Create admin login UI
  - [x] Implement API endpoint for admin authentication

### Feature: Authorization and role-based access control
- [x] Implement RBAC middleware/guards on backend
  - [x] Define permissions (e.g., view/edit timesheets, generate payslips, manage employees)
- [x] Implement frontend route guards and UI gating
  - [x] Hide admin-only actions from employee UI

### Feature: Employee and admin account management (Admin-facing)
- [x] Implement CRUD for employees (create, activate/deactivate, update details)
  - [x] Create admin UI for employee list + employee detail
  - [x] Implement API endpoints for employee CRUD
  - [x] Add validation (unique employee number, required fields)
- [ ] Implement password/PIN management
  - [ ] Implement admin reset PIN/password actions
  - [ ] Implement employee change PIN/password (optional)

---

## Epic 3: Employee Time Logging (Clock In/Out + Break In/Out)

### Feature: Employee time kiosk / time logging UI
- [x] Build employee time logging screen (Employee Number input + action buttons)
  - [x] Display current server time and employee status (e.g., “Clocked In”, “On Break”)
  - [x] Show last action and timestamp for confirmation
- [x] Implement “analog clock” widget in UI (optional)
  - [x] Add fallback to digital clock on unsupported browsers

### Feature: Time logging API and persistence
- [ ] Implement API endpoint to create time log events (clock in/out, break in/out)
  - [ ] Validate state transitions (prevent break-out without break-in, etc.)
  - [ ] Enforce idempotency (avoid double submissions on refresh/retry)
- [ ] Persist time log events and compute derived sessions
  - [ ] Store raw events (event-based) and/or computed intervals (session-based)
  - [ ] Implement server-side timestamp authority (avoid client-side time spoofing)

### Feature: Real-time and UX resilience
- [ ] Add loading, success, and error states to employee UI
  - [ ] Provide actionable error messages (e.g., “You are already clocked in.”)
- [ ] Implement offline/poor network handling (optional)
  - [ ] Queue events locally and sync when online (with strict safeguards)

### Feature: Audit trail and security controls
- [ ] Record audit metadata (who, when, device/IP if available)
- [ ] Implement rate limiting and abuse prevention for kiosk endpoint

---

## Epic 4: Timesheet Generation and Management (Admin-facing)

### Feature: Automated timesheet generation
- [ ] Implement backend service to compute daily/weekly timesheets per employee
  - [ ] Aggregate clock sessions and breaks into total worked hours per day
  - [ ] Flag anomalies (missing clock-out, overlapping breaks, etc.)
- [ ] Implement scheduled jobs (or on-demand generation per pay period)
  - [ ] Add job retries and logging

### Feature: Timesheet review and correction workflow (Admin UI + API)
- [ ] Build admin timesheet UI (filters by employee, date range, status)
  - [ ] Show raw events and computed hours side-by-side
- [ ] Implement timesheet adjustment capability
  - [ ] Implement API for admin adjustments (with reason required)
  - [ ] Track adjustment history (before/after values, reason, admin user)
  - [ ] Lock rules (e.g., cannot edit after payslip generated unless reopened)

### Feature: Approvals and status management (optional but recommended)
- [ ] Implement timesheet statuses (Draft → Reviewed → Approved → Locked)
  - [ ] Implement API to change status with permission checks
  - [ ] Add UI actions for review/approve/lock

---

## Epic 5: Payroll Rules, Pay Periods, and Payslip Generation

### Feature: Pay period management
- [ ] Implement pay period model and CRUD (semi-monthly/monthly configuration)
  - [ ] Create admin UI to create/close pay periods
  - [ ] Implement API endpoints for pay period management

### Feature: Payroll calculation engine
- [ ] Implement payroll calculation using timesheet data
  - [ ] Compute regular hours, break deductions, overtime (if configured), late/undertime (optional)
  - [ ] Apply rounding rules (e.g., nearest minute/quarter-hour)
- [ ] Implement earnings/deductions model (basic)
  - [ ] Base hourly rate or salary basis per employee
  - [ ] Configurable deductions/allowances (fixed or percentage, optional)

### Feature: Payslip generation (Admin)
- [ ] Build admin payslip generation flow
  - [ ] Generate payslips for selected employees and pay period
  - [ ] Preview payslip before finalizing
- [ ] Implement backend endpoints for payslip generation and retrieval
  - [ ] Ensure deterministic recalculation rules (or store computed snapshot)
  - [ ] Implement payslip versioning or “finalized” state

### Feature: Payslip export and distribution
- [ ] Implement PDF generation for payslips
  - [ ] Create payslip template (company info, employee info, period, breakdown)
- [ ] Implement bulk export (ZIP of PDFs) for admins
- [ ] Implement employee payslip viewing (optional)
  - [ ] Employee portal page to view/download their payslips

---

## Epic 6: Admin Dashboard and Reporting

### Feature: Admin overview dashboard
- [x] Build dashboard widgets (today’s attendance, currently clocked-in, on break)
- [ ] Implement API endpoints to support dashboard queries
  - [ ] Optimize queries with indexes/caching where needed

### Feature: Reports and exports (basic)
- [ ] Implement timesheet export (CSV) by pay period and employee
- [ ] Implement attendance summary report (daily totals, anomalies)
- [ ] Add filters and sorting (department, cost center, date range)

---

## Epic 7: System Settings and Configuration (Basic)

### Feature: Company and payroll settings (Admin)
- [ ] Implement settings screens (company details, timezone, pay period type)
- [ ] Implement time policies (grace periods, rounding rules, break policies)
- [ ] Implement pay policies (overtime rules, default hourly rate rules)

### Feature: Security and compliance settings
- [ ] Configure session duration, password policy, PIN policy
- [ ] Implement data retention policy settings (optional)

---

## Epic 8: Quality, Testing, and Hardening

### Feature: Automated testing
- [ ] Write backend unit tests for time state machine and payroll calculations
  - [ ] Add test cases for edge scenarios (missing clock-out, multiple breaks, DST/timezone)
- [ ] Write frontend tests for critical flows (time logging, admin generation)
- [ ] Add integration tests for end-to-end pay period → payslip flow

### Feature: Performance and reliability
- [ ] Add database indexes for high-traffic queries (latest status per employee, logs by period)
- [ ] Implement caching for dashboard queries (optional)
- [ ] Add concurrency protections (transactional writes, unique constraints)

### Feature: Security reviews
- [ ] Validate access controls (admin endpoints protected, employee scope enforced)
- [ ] Add input sanitization and output escaping
- [ ] Add audit logging for admin actions (adjustments, payslip generation)

---

## Epic 9: UX Polish and Documentation

### Feature: Employee UX improvements
- [ ] Add clear confirmations and receipts (e.g., “Clock In successful at 08:01”)
- [ ] Add friendly guidance for invalid actions (e.g., “You need to Break In first.”)

### Feature: Admin UX improvements
- [ ] Add empty states, loading states, bulk actions, and keyboard-friendly forms
- [ ] Add inline anomaly highlighting and quick-fix actions

### Feature: Documentation and onboarding
- [ ] Create admin guide (setup, pay periods, generating payslips)
- [ ] Create employee guide (how to clock in/out and break in/out)
- [ ] Create developer README (local setup, env vars, migrations, deployment)

---

# Implementation Notes
- Assumed a web-based system with two primary roles: **Employee** (time logging) and **Admin** (management + payroll).
- Assumed server-side timestamps are the source of truth to reduce time spoofing; client time is display-only.
- Assumed payroll is primarily derived from **timesheets computed from time logs**, with optional admin adjustments tracked via audit history.
- Assumed “payslip” is stored as a **finalized snapshot** once generated to avoid retroactive changes unless explicitly reopened/versioned.
- Overtime, rounding, and deductions are included as **configurable basics**; you can simplify by deferring them if your MVP is “total hours × rate.”
