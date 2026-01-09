# TimeSlip-HR Developer Documentation

Complete developer guide for setting up, developing, and deploying TimeSlip-HR.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Local Development Setup](#2-local-development-setup)
3. [Environment Variables](#3-environment-variables)
4. [Database Management](#4-database-management)
5. [Testing](#5-testing)
6. [API Documentation](#6-api-documentation)
7. [Deployment](#7-deployment)
8. [Code Standards](#8-code-standards)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Project Overview

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | NestJS 11.0, TypeScript, TypeORM 0.3 |
| **Frontend** | Next.js 15.1 (App Router), React, Redux Toolkit |
| **Database** | PostgreSQL |
| **Auth** | JWT (access + refresh tokens), Passport.js |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |

### Architecture

```
timeslip-hr/
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── modules/   # Feature modules (auth, employee, timesheet, etc.)
│   │   ├── entities/  # TypeORM entities
│   │   ├── types/     # Shared TypeScript types/enums
│   │   ├── guards/    # Auth & role guards
│   │   └── main.ts    # Entry point
│   └── httpyac/       # API test files
├── frontend/          # Next.js application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── store/         # Redux slices and thunks
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utilities, API clients
├── project-docs/      # Project documentation
└── README.md          # This file
```

### Authentication Flow

```
1. User logs in with email/password
2. Backend validates → Returns access + refresh tokens
3. Frontend stores tokens in localStorage
4. API requests include: Authorization: Bearer <access_token>
5. On 401 → Frontend uses refresh token to get new access token
6. Refresh token rotation: new refresh token issued each refresh
```

---

## 2. Local Development Setup

### Prerequisites

- **Node.js**: v20+ (LTS recommended)
- **pnpm**: v8+ (`npm install -g pnpm`)
- **PostgreSQL**: v14+ (or Docker)
- **Docker** (optional): For database container

### Clone Repository

```bash
git clone https://github.com/your-org/timeslip-hr.git
cd timeslip-hr
```

### Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
pnpm install
```

### Database Setup

#### Option A: Docker (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d postgres

# Database will be available at localhost:5432
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database: `CREATE DATABASE timeslip_hr;`
3. Create user with permissions

### Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

### Run Migrations

```bash
cd backend
pnpm migration:run
```

### Seed Database (Optional)

```bash
cd backend
pnpm seed
```

This creates:
- Admin user: `admin@example.com` / `password123`
- Sample employees
- Sample time events

### Start Development Servers

```bash
# Terminal 1: Backend (port 3001)
cd backend
pnpm start:dev

# Terminal 2: Frontend (port 3000)
cd frontend
pnpm dev
```

### Verify Setup

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

---

## 3. Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/timeslip_hr
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=timeslip_hr

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_KIOSK=true
```

### Production Considerations

- Use strong, unique `JWT_SECRET` (32+ characters)
- Set `NODE_ENV=production`
- Use secure database credentials
- Configure proper CORS origins

---

## 4. Database Management

### TypeORM CLI

```bash
cd backend

# Generate migration from entity changes
pnpm migration:generate src/database/migrations/MigrationName

# Run pending migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert

# Show migration status
pnpm migration:show
```

### Schema Reference

See [project-docs/domain-model.md](./project-docs/domain-model.md) for complete entity relationships.

**Key Entities:**
- `User` - Admin and employee accounts
- `Employee` - Employee profiles and compensation
- `TimeEvent` - Raw clock in/out events
- `Timesheet` - Computed work summaries
- `PayPeriod` - Payroll date ranges
- `Payslip` - Generated pay records

### Seeders

```bash
cd backend

# Run all seeders
pnpm seed

# Run specific seeder (if implemented)
pnpm seed:employees
pnpm seed:time-events
```

---

## 5. Testing

### Backend Tests

```bash
cd backend

# Run all tests
pnpm test

# Run with coverage
pnpm test:cov

# Run specific test file
pnpm test -- employee.service.spec.ts

# Run in watch mode
pnpm test:watch
```

**Test Locations:**
- Unit tests: `src/modules/*/providers/*.spec.ts`
- E2E tests: `test/*.e2e-spec.ts`

### Frontend Tests

```bash
cd frontend

# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

**Test Locations:**
- Component tests: `__tests__/` or `*.test.tsx`
- Hook tests: `hooks/**/*.test.ts`

### Writing Tests

#### Backend (Jest + NestJS Testing)

```typescript
// employee.service.spec.ts
describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: Repository<Employee>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: getRepositoryToken(Employee), useClass: Repository },
      ],
    }).compile();

    service = module.get(EmployeeService);
    repository = module.get(getRepositoryToken(Employee));
  });

  it('should find all employees', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockEmployee]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });
});
```

#### Frontend (Jest + React Testing Library)

```typescript
// EmployeeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from './EmployeeCard';

describe('EmployeeCard', () => {
  it('renders employee name', () => {
    render(<EmployeeCard name="John Doe" employeeNo="1001" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## 6. API Documentation

### Swagger UI

Access Swagger documentation at: **http://localhost:3001/api/docs**

Features:
- Interactive API explorer
- Request/response schemas
- Try endpoints directly

### Authentication

Most endpoints require JWT authentication:

```bash
# 1. Login to get tokens
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Response: { "accessToken": "...", "refreshToken": "..." }

# 2. Use token in requests
curl http://localhost:3001/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Common Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login, get tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/employees` | List all employees |
| POST | `/employees` | Create employee |
| GET | `/timesheets` | List timesheets |
| POST | `/timesheets/generate` | Generate timesheets |
| GET | `/payroll/pay-periods` | List pay periods |
| POST | `/payroll/payslips/generate` | Generate payslips |

See Swagger for complete API reference.

---

## 7. Deployment

### Build Commands

```bash
# Backend
cd backend
pnpm build
# Output: dist/

# Frontend
cd frontend
pnpm build
# Output: .next/
```

### Production Environment

```bash
# Backend
NODE_ENV=production node dist/main.js

# Frontend
pnpm start  # Starts Next.js in production mode
```

### Docker Deployment

```dockerfile
# Backend Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Database Migrations (Production)

```bash
# Run migrations before starting the app
NODE_ENV=production pnpm migration:run
```

### Recommended Hosting

| Service | Use For |
|---------|---------|
| **Vercel** | Frontend (Next.js optimized) |
| **Railway** | Backend + PostgreSQL |
| **Render** | Full-stack deployment |
| **AWS/GCP** | Enterprise deployments |

---

## 8. Code Standards

### Backend Standards

See full details: [project-docs/backend-standards.md](./project-docs/backend-standards.md)

**Key Points:**
- Modular architecture with NestJS modules
- DTOs for all request validation
- Services contain business logic, controllers handle routing
- Types/enums in `src/types/`
- Use dependency injection, avoid `new`

### Frontend Standards

See full details: [project-docs/frontend-standards.md](./project-docs/frontend-standards.md)

**Key Points:**
- App Router structure
- Redux Toolkit for state
- Custom hooks for business logic
- Use centralized `api` instance (never create new axios instances)
- `cn()` utility for conditional classes

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files/Dirs | dash-case | `employee-service.ts` |
| Classes | PascalCase | `EmployeeService` |
| Functions/Vars | camelCase | `findAllEmployees` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Components | PascalCase | `EmployeeCard.tsx` |

---

## 9. Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify port is not blocked

#### Module Not Found

```
Cannot find module '@/lib/api'
```

**Solutions:**
- Run `pnpm install`
- Check `tsconfig.json` paths configuration
- Restart TypeScript server in IDE

#### JWT Token Issues

```
JsonWebTokenError: invalid signature
```

**Solutions:**
- Verify `JWT_SECRET` matches in frontend/backend
- Clear localStorage and re-login
- Check token hasn't been modified

#### CORS Errors

```
Access-Control-Allow-Origin error
```

**Solutions:**
- Verify `CORS_ORIGIN` includes frontend URL
- Check for trailing slashes in URLs
- Ensure credentials: true is set correctly

### Getting Help

1. Check this troubleshooting section
2. Search existing GitHub issues
3. Review backend logs (`pnpm start:dev` shows detailed logs)
4. Ask in project Slack/Discord channel
5. Create a new GitHub issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs
   - Environment details

---

## Quick Commands Reference

```bash
# Install
pnpm install

# Development
cd backend && pnpm start:dev
cd frontend && pnpm dev

# Testing
cd backend && pnpm test
cd frontend && pnpm test

# Building
cd backend && pnpm build
cd frontend && pnpm build

# Database
cd backend && pnpm migration:run
cd backend && pnpm seed

# Linting
pnpm lint
```

---

*Last Updated: January 2026*
