# IMPLEMENTATION PLAN: TimeSlip-HR v1.0

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-5.1 |
| **Epic Name** | Implementation & Release Plan |
| **Status** | ✅ Done |
| **Priority** | N/A |
| **Sprint** | Sprint 1-8 |
| **Completion** | January 2026 |

---

## Purpose

Define the chronological rollout of all epics to ensure dependencies are met and value is delivered incrementally.

---

## Phases

### PHASE 1: Foundations (Sprint 1-2)
**Goal:** Stable architecture and simple auth.
- [x] EPIC-01: Backend/Frontend Setup
- [x] EPIC-02: Basic Auth & User Management

### PHASE 2: Core Time Tracking (Sprint 3-4)
**Goal:** Employees can clock in/out.
- [x] EPIC-03: Kiosk Logic & API
- [x] EPIC-07: Basic Settings (Timezone, Policies)

### PHASE 3: Timesheets & Payroll (Sprint 5-6)
**Goal:** Admins can pay employees.
- [x] EPIC-04: Timesheet Generation
- [x] EPIC-05: Payroll & Payslips

### PHASE 4: Polish & Release (Sprint 7-8)
**Goal:** Production ready.
- [x] EPIC-06: Dashboard & Reports
- [x] EPIC-08: QA & Testing
- [x] EPIC-09: Documentation

---

## Technical Stack Finalized

**Backend**
- NestJS 11
- TypeORM (Postgres)
- Passport (JWT/Argon2)
- PDFKit (Payslips)

**Frontend**
- Next.js 15 (App Router)
- Redux Toolkit
- Tailwind CSS
- shadcn/ui

**Infrastructure**
- Docker (optional)
- GitHub Actions (CI)
