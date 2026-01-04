# Epic 1: Foundations, Architecture, and DevOps

## Feature: Define core domain model and business rules
- [x] Define core entities and relationships (Employee, Admin/User, TimeLog, Timesheet, PayPeriod, Payslip, Settings)
- [x] Document TimeLog state machine (Clocked Out → Clocked In → Break In/Out → Clock Out)
- [x] Define validation rules (no overlapping sessions, required sequences, idempotency on submissions)
- [x] Define pay and time computation rules (rounding, grace periods, overtime rules if any)
- [x] Specify how break time impacts paid hours (paid/unpaid breaks)

## Feature: Set up backend scaffolding
- [x] Initialize backend project (API routing, config, validation, error handling)
- [x] Set up database schema and migrations
  - [x] Create tables for users/employees, time logs, pay periods, payslips, settings
- [x] Implement shared utilities (date/time helpers, money helpers, audit logging)

## Feature: Set up frontend scaffolding
- [x] Initialize frontend project (routing, layouts, state management, UI kit)
- [x] Implement role-based routing guards (Employee vs Admin)

## Feature: CI/CD and basic observability
- [x] Configure CI pipeline (lint, tests, build)
- [x] Configure deployment pipeline (staging/prod)
- [x] Implement basic logging/monitoring hooks (API request logs, error boundaries)
