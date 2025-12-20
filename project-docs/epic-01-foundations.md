# Epic 1: Foundations, Architecture, and DevOps

## Feature: Define core domain model and business rules
- [ ] Define core entities and relationships (Employee, Admin/User, TimeLog, Timesheet, PayPeriod, Payslip, Settings)
  - [ ] Document TimeLog state machine (Clocked Out → Clocked In → Break In/Out → Clock Out)
  - [ ] Define validation rules (no overlapping sessions, required sequences, idempotency on submissions)
- [ ] Define pay and time computation rules (rounding, grace periods, overtime rules if any)
  - [ ] Specify how break time impacts paid hours (paid/unpaid breaks)

## Feature: Set up backend scaffolding
- [ ] Initialize backend project (API routing, config, validation, error handling)
- [ ] Set up database schema and migrations
  - [ ] Create tables for users/employees, time logs, pay periods, payslips, settings
- [ ] Implement shared utilities (date/time helpers, money helpers, audit logging)

## Feature: Set up frontend scaffolding
- [ ] Initialize frontend project (routing, layouts, state management, UI kit)
- [ ] Implement role-based routing guards (Employee vs Admin)

## Feature: CI/CD and basic observability
- [ ] Configure CI pipeline (lint, tests, build)
- [ ] Configure deployment pipeline (staging/prod)
- [ ] Implement basic logging/monitoring hooks (API request logs, error boundaries)
