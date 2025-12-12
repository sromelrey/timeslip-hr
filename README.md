# Mini HRIS (Timekeeping + Payslips) — JWT Starter Template

A fullstack starter template for building a **Mini HRIS** with **JWT (JSON Web Token)** authentication.  
It supports **employee time logging** (clock in/out, break in/out) and **admin payroll workflows** (timesheets, pay periods, payslip generation), using a modern NestJS + Next.js stack.

## What this app does (core scope)

### Employee-facing
- Clock In
- Clock Out
- Break In
- Break Out
- View current status (clocked in / on break / clocked out)
- (Optional) View/download payslips

### Admin-facing
- Manage employees (basic CRUD)
- Review time logs and computed timesheets
- Create/manage pay periods
- Generate payslips from time records (with export options)

## Authentication & Roles

This template uses **token-based authentication**:
- **Access token** (short-lived) + **Refresh token** (rotating)
- Designed to support multiple clients (web, mobile, kiosk)

Roles (typical):
- **ADMIN** – can manage employees, timesheets, pay periods, payslips, settings
- **EMPLOYEE** – can submit time events and view own data

## When to use this template

Use this JWT-based starter when:
- You want stateless auth that scales well across instances.
- You plan to support multiple clients (e.g., admin web + employee kiosk + mobile).
- You want explicit access/refresh token handling and rotation.

Consider a **session-based** starter instead when:
- Your app is primarily server-rendered and browser-only.
- You prefer cookie-based sessions without managing tokens on multiple clients.

## Structure

- `backend/` – NestJS API with JWT auth, TypeORM, PostgreSQL, Swagger, Docker
- `frontend/` – Next.js 15 App Router, Redux Toolkit, Axios with JWT interceptors, TailwindCSS

## Key Modules (planned)

### Backend (NestJS)
- Auth (JWT access/refresh, role guards)
- Employees (employee profiles and employment details)
- Time Events (clock in/out, break in/out with state validation)
- Timesheets (computed summaries and anomaly flags)
- Pay Periods (open/close payroll windows)
- Payslips (calculation + PDF/export support)
- Settings (timezone, rounding rules, overtime/break policies)

### Frontend (Next.js)
- Employee Time Kiosk UI (employee number + actions + status)
- Admin Dashboard (attendance overview)
- Admin Timesheets (review, adjust, approve/lock)
- Admin Payslips (generate, preview, export)
- Settings screens (basic policies)
