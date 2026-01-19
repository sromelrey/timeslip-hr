# EPIC-01: Foundations, Architecture, and DevOps

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-01 |
| **Epic Name** | Foundations, Architecture, and DevOps |
| **Status** | ✅ Done |
| **Priority** | Critical |
| **Sprint** | Sprint 1–2 |
| **Completion** | December 2025 |
| **Story Points** | 34 |

---

## Purpose

Establish the foundational architecture for **TimeSlip-HR** so future epics can be built safely and consistently. This includes:

- Core domain model + rules (what the system is and how it behaves)
- Backend and frontend scaffolding (clean project structure and standards)
- Database schema + migrations + seed scripts (repeatable local/staging setup)
- CI/CD pipelines (quality gates + consistent deployments)

---

## Definition of Done

This epic is considered complete when:

- [x] Backend and frontend projects boot successfully in a clean environment
- [x] Database migrations run from scratch and create all tables/indexes
- [x] Seed scripts create at least:
  - [x] 1 Company
  - [x] 1 Admin user
  - [x] 1 Employee user
- [x] Swagger docs are available for backend APIs
- [x] CI runs on every PR (lint + test + build)
- [x] Merge to `main` is blocked unless CI passes
- [x] Deployment pipeline exists and can deploy backend + frontend (staging/prod as configured)

---

## Stories

### STORY-001: Define Core Domain Model
| Field | Value |
|-------|-------|
| **Story ID** | STORY-001 |
| **Status** | ✅ Done |
| **Assignee** | Backend Team |
| **Story Points** | 8 |

**Description:**  
As a developer, I need a well-defined domain model so the team has a shared understanding of data structures, relationships, and core rules.

**Acceptance Criteria:**
- [x] Define core entities: `Company`, `User`, `Employee`, `TimeEvent`, `PayPeriod`, `Timesheet`, `TimesheetDay`, `Payslip`, `Setting`
- [x] Document entity relationships in an ERD
- [x] Define `TimeEvent` state machine and valid transitions
- [x] Specify validation rules (no overlaps, required sequences, idempotency)
- [x] Document pay computation rules (rounding, overtime, breaks)

**TimeEvent State Machine**
Valid transitions (server-enforced):
- [x] `CLOCKED_OUT → CLOCK_IN`
- [x] `CLOCK_IN → BREAK_IN`
- [x] `BREAK_IN → BREAK_OUT`
- [x] `BREAK_OUT → BREAK_IN` (optional; allows multiple breaks)
- [x] `CLOCK_IN → CLOCK_OUT`
- [x] `BREAK_OUT → CLOCK_OUT`

Rules:
- [x] No overlapping sessions (cannot be clocked in twice at the same time)
- [x] Break events must occur only when clocked in
- [x] `CLOCK_OUT` ends the session and resets to `CLOCKED_OUT`
- [x] Idempotency is enforced (duplicate submissions should not create duplicate events)

**Technical Notes:**
- 17 TypeORM entities created
- Soft delete pattern implemented via `deletedAt`
- Multi-tenant support via `companyId` on all entities
- State machine enforced in `TimeEventService.validateTransition()`

---

### STORY-002: Backend Project Setup
| Field | Value |
|-------|-------|
| **Story ID** | STORY-002 |
| **Status** | ✅ Done |
| **Assignee** | Backend Team |
| **Story Points** | 8 |

**Description:**  
As a developer, I need a properly configured backend project so I can build features efficiently with consistent patterns and guardrails.

**Acceptance Criteria:**
- [x] Initialize NestJS 11 project with TypeScript
- [x] Configure TypeORM with PostgreSQL
- [x] Set up feature/module-based architecture
- [x] Implement global exception handling and standard error responses
- [x] Configure global validation pipes (class-validator / DTO validation)
- [x] Set up Swagger documentation
- [x] Create `CommonEntity` base class for consistent columns (id, timestamps, soft delete)

#### Sub-Task: BE-002-1 – NestJS Initialization
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-002-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Initialized NestJS 11 project using `@nestjs/cli`
- Configured TypeScript strict mode
- Set up `tsconfig.json` with path aliases (`@/`)

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/package.json` | [NEW] Project configuration |
| `backend/tsconfig.json` | [NEW] TypeScript config |
| `backend/nest-cli.json` | [NEW] Nest CLI config |

---

#### Sub-Task: BE-002-2 – TypeORM & Database Configuration
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-002-2 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Configured TypeORM with PostgreSQL driver
- Set up data source with environment variables
- Created migration data source for CLI

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/app.module.ts` | [MODIFY] Added TypeOrmModule config |
| `backend/migration-data-source.ts` | [NEW] TypeORM CLI data source |
| `backend/.env.example` | [NEW] Environment template |

---

#### Sub-Task: BE-002-3 – Module Architecture & Base Classes
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-002-3 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Set up feature-based module structure
- Created `CommonEntity` base class with id, timestamps, soft delete
- Implemented global exception filter
- Configured validation pipes

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/common/entities/common.entity.ts` | [NEW] Base entity class |
| `backend/src/common/filters/http-exception.filter.ts` | [NEW] Global error handler |
| `backend/src/main.ts` | [MODIFY] Bootstrap config |

**Tech Stack:**
| Technology | Version |
|------------|---------|
| NestJS | 11.0.1 |
| TypeORM | 0.3.x |
| PostgreSQL | 14+ |
| Argon2 | Latest |
| class-validator | Latest |

**Project Structure:**
```bash
backend/src/
├── app.module.ts          # Root module
├── main.ts                # Bootstrap entry point
├── common/                # Shared decorators, filters, pipes
├── database/              # Migrations, seeds, schema scripts
├── entities/              # TypeORM entities (17 files)
├── guards/                # JwtAuthGuard, RolesGuard
├── middlewares/           # Request logging, etc.
├── modules/               # Feature modules (auth, employee, payroll, etc.)
└── types/                 # Enums, interfaces, DTOs
```

---

### STORY-003: Database Schema & Migrations
| Field | Value |
|-------|-------|
| **Story ID** | STORY-003 |
| **Status** | ✅ Done |
| **Assignee** | Backend Team |
| **Story Points** | 5 |

**Description:**  
As a developer, I need database tables and seed scripts so I can run the app locally with realistic test data.

#### Sub-Task: BE-003-1 – Entity Definitions
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-003-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
Created 17 TypeORM entities with relationships:

| Entity | File | Purpose |
|--------|------|---------|
| `Company` | `company.entity.ts` | Multi-tenant organization |
| `User` | `user.entity.ts` | Admin/Employee login accounts |
| `Employee` | `employee.entity.ts` | HR employee records |
| `EmployeeCompensation` | `employee-compensation.entity.ts` | Salary/rate history |
| `TimeEvent` | `time-event.entity.ts` | Clock in/out, break events |
| `PayPeriod` | `pay-period.entity.ts` | Pay cycle definition |
| `Timesheet` | `timesheet.entity.ts` | Aggregated hours per period |
| `TimesheetDay` | `timesheet-day.entity.ts` | Daily breakdown |
| `TimesheetAdjustment` | `timesheet-adjustment.entity.ts` | Manual corrections |
| `TimesheetAnomaly` | `timesheet-anomaly.entity.ts` | Flagged issues |
| `Payslip` | `payslip.entity.ts` | Generated pay record |
| `PayslipItem` | `payslip-item.entity.ts` | Earnings/deduction lines |
| `Deduction` | `deduction.entity.ts` | Employee deductions |
| `Setting` | `setting.entity.ts` | Company configuration |
| `AuditLog` | `audit-log.entity.ts` | Admin action tracking |

---

#### Sub-Task: BE-003-2 – Indexes & Constraints
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-003-2 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Added unique indexes (email, employee number per company)
- Added performance indexes on foreign keys
- Added composite indexes for common queries

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/database/add-indexes.ts` | [NEW] Index addition script |
| `backend/src/database/migrations/1736467200000-add-performance-indexes.ts` | [NEW] Migration file |

---

#### Sub-Task: BE-003-3 – Seed Scripts
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-003-3 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created seed script for Company, Admin, Employees
- Added database reset functionality

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/database/seeds/seeder.ts` | [NEW] Main seeder entry |
| `backend/src/database/drop-schema.ts` | [NEW] Schema drop script |

**Scripts:**
```bash
pnpm migrate     # Run TypeORM migrations
pnpm seed        # Seed test data (company, admin, employees)
pnpm db:reset    # Drop schema and re-seed
pnpm add-indexes # Add performance indexes
```

---

### STORY-004: Frontend Project Setup
| Field | Value |
|-------|-------|
| **Story ID** | STORY-004 |
| **Status** | ✅ Done |
| **Assignee** | Frontend Team |
| **Story Points** | 8 |

**Description:**  
As a developer, I need a properly configured frontend project so I can build UI features with consistent patterns.

#### Sub-Task: FE-004-1 – Next.js Initialization
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-004-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Initialized Next.js 15 with App Router
- Configured TypeScript
- Set up Tailwind CSS

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/package.json` | [NEW] Project configuration |
| `frontend/next.config.ts` | [NEW] Next.js config |
| `frontend/tailwind.config.ts` | [NEW] Tailwind config |
| `frontend/postcss.config.mjs` | [NEW] PostCSS config |
| `frontend/tsconfig.json` | [NEW] TypeScript config |

**Tech Stack:**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.4.10 | React framework with App Router |
| React | 19.0.0 | UI library |
| Tailwind CSS | 3.4.17 | Utility-first styling |

---

#### Sub-Task: FE-004-2 – State Management Setup
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-004-2 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Set up Redux Toolkit store
- Created auth slice and thunks
- Configured Axios instance with interceptors

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/store/index.ts` | [NEW] Redux store configuration |
| `frontend/store/slices/auth-slice.ts` | [NEW] Auth state slice |
| `frontend/store/thunks/auth-thunks.ts` | [NEW] Auth API thunks |
| `frontend/lib/api.ts` | [NEW] Axios instance |

**Tech Stack:**
| Technology | Version | Purpose |
|------------|---------|---------|
| Redux Toolkit | 2.5.0 | State management |
| Axios | 1.7.9 | HTTP client |

---

#### Sub-Task: FE-004-3 – UI Components & Layout
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-004-3 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Installed and configured shadcn/ui components
- Created route group layouts
- Set up admin sidebar navigation

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/components/ui/` | [NEW] shadcn/ui components |
| `frontend/app/layout.tsx` | [NEW] Root layout |
| `frontend/app/(admin)/layout.tsx` | [NEW] Admin layout with sidebar |
| `frontend/components/admin/sidebar.tsx` | [NEW] Admin navigation |

**Tech Stack:**
| Technology | Version | Purpose |
|------------|---------|---------|
| Radix UI | Various | Accessible UI primitives |
| TanStack Table | 8.21.3 | Data tables |
| React Hook Form | 7.70.0 | Form handling |
| Lucide React | 0.561.0 | Icons |

---

#### Sub-Task: FE-004-4 – Route Protection
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-004-4 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Implemented Next.js middleware for route protection
- Created role-based access control

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/middleware.ts` | [NEW] Route protection logic |

**Route Protection:**
| Route | Required Role | Redirect |
|-------|---------------|----------|
| `/admin/*` | `ADMIN` | `/sign-in` |
| `/portal/*` | `EMPLOYEE` | `/sign-in` |
| `/kiosk` | None (PIN) | N/A |
| `/sign-in` | None | N/A |

**Project Structure:**
```bash
frontend/
├── app/                   # Next.js App Router
│   ├── (admin)/           # Admin routes (protected)
│   │   ├── dashboard/
│   │   ├── employee/
│   │   ├── timesheet/
│   │   ├── payroll/
│   │   ├── reports/
│   │   └── settings/
│   ├── (auth)/            # Auth routes
│   │   └── sign-in/
│   ├── kiosk/             # Employee time logging (PIN auth)
│   ├── portal/            # Employee self-service
│   └── layout.tsx         # Root layout
├── components/            # UI components (44 files)
│   ├── admin/             # Admin-specific components
│   ├── kiosk/             # Kiosk components
│   └── ui/                # Shared UI (shadcn/ui)
├── hooks/                 # Custom hooks (24 files)
├── lib/                   # Utilities (api.ts, utils.ts)
├── store/                 # Redux store, slices, thunks
└── middleware.ts          # Route protection
```

---

### STORY-005: CI/CD Pipeline Setup
| Field | Value |
|-------|-------|
| **Story ID** | STORY-005 |
| **Status** | ✅ Done |
| **Assignee** | DevOps |
| **Story Points** | 5 |

**Description:**  
As a developer, I need automated CI/CD so code quality is enforced and deployments are consistent.

#### Sub-Task: DEVOPS-005-1 – CI Pipeline (Backend)
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DEVOPS-005-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Configured ESLint
- Set up Jest for unit testing
- Added npm scripts for CI

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/.eslintrc.js` | [NEW] ESLint config |
| `backend/jest.config.js` | [NEW] Jest config |
| `backend/package.json` | [MODIFY] Added scripts |

**Scripts:**
```bash
pnpm lint        # ESLint
pnpm test        # Jest unit tests
pnpm test:cov    # Test with coverage
pnpm build       # NestJS build
```

---

#### Sub-Task: DEVOPS-005-2 – CI Pipeline (Frontend)
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DEVOPS-005-2 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Configured ESLint with Next.js rules
- Set up Jest with React Testing Library
- Added npm scripts for CI

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/.eslintrc.json` | [NEW] ESLint config |
| `frontend/jest.config.ts` | [NEW] Jest config |
| `frontend/jest.setup.ts` | [NEW] Jest setup |
| `frontend/package.json` | [MODIFY] Added scripts |

**Scripts:**
```bash
pnpm lint        # ESLint
pnpm test        # Jest tests
pnpm build       # Next.js build
pnpm dev         # Dev server (port 3001)
```

---

#### Sub-Task: DEVOPS-005-3 – GitHub Actions
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DEVOPS-005-3 |
| **Status** | ✅ Done |
| **Type** | DevOps |

**Changes Made:**
- Created CI workflow for PRs
- Configured branch protection rules

**CI Pipeline Steps:**
| Step | Backend | Frontend |
|------|---------|----------|
| Lint | `pnpm lint` | `pnpm lint` |
| Test | `pnpm test` | `pnpm test` |
| Build | `pnpm build` | `pnpm build` |
| Type Check | `tsc --noEmit` | `tsc --noEmit` |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Blocks** | EPIC-02, EPIC-03, EPIC-04, EPIC-05, EPIC-06, EPIC-07, EPIC-08, EPIC-09 |
| **Blocked By** | None (first epic) |

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Multi-tenant architecture | Support multiple companies in single deployment |
| Soft deletes | Maintain audit trail, enable data recovery |
| Server-authoritative time | Prevent client-side time manipulation |
| Feature-based modules | Better code organization and maintainability |
| TypeScript strict mode | Catch errors at compile time |
| JWT + Refresh tokens | Secure stateless authentication |
| Redux Toolkit | Predictable state management with thunks |
