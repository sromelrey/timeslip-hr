# TimeSlip-HR Regression Testing Guide

This guide outlines the critical end-to-end flows that must be verified before any major release. It utilizes the built-in database seeder to ensure a consistent starting point for all tests.

## Initial Setup: Data Environment
**Objective:** Prepare a clean database with all necessary mock data for isolation and complex flow testing.

1. **Database Reset**:
   - Run `npm run db:reset` in the `backend` directory.
   - **What this does**: Automatically drops the schema, recreates tables, and runs all seeders (Companies, Users, Employees, Pay Periods, etc.).
2. **Verify Connections**:
   - Ensure the backend (`npm run start:dev`) and frontend (`npm run dev`) are running without errors.

---

## Regression Flow 0: Super Admin Global Operations
**Objective:** Verify that a Super Admin can manage the entire system and oversee all companies.

1. **Super Admin Login:**
   - Log in with credentials: `superadmin@example.com` / `password123`.
   - Verify redirect to `/super-admin/dashboard`.
   - Verify System Admin sidebar is present with "Global Stats", "Companies", and "System Settings".
2. **Global Analytics:**
   - Verify "Total Companies" (3), "Total Users", and "Total Employees" display the expected seeded values.
3. **Company Management:**
   - Navigate to `/super-admin/companies`.
   - **View Seeded**: Verify "Acme Corp", "Tech Solutions Inc.", and "Startup Hub" are present.
   - **Manual Create**: Add a new company "Regression Test Organization".
   - **Edit**: Rename it and verify changes persist.

---

## Regression Flow 1: Multi-Tenant Isolation
**Objective:** Verify that data is isolated between different companies.

1. **Admin Login (Acme Corp):**
   - Log in with `admin@example.com` / `password123`.
2. **Isolation Check:**
   - Navigate to `/admin/employee`.
   - Verify only employees belonging to **Acme Corp** (e.g., John Doe) are visible.
   - Employees from "Tech Solutions Inc." should NOT be listed.
3. **Switch Context:**
   - Log out and log in as an Admin for another account or the Super Admin to verify the global view.

---

## Regression Flow 2: Workforce & Time Tracking
**Objective:** Verify that seeded employees can log time and that the UI handles high activity.

1. **Kiosk Activity:**
   - Navigate to `/kiosk`.
   - Log in as a seeded employee (e.g., John Doe - look up ID/PIN in database or admin panel).
   - Perform: **Clock In** -> **Clock Out**.
2. **Timesheet Row-Level Loading:**
   - Navigate to `/admin/timesheet`.
   - Find John Doe's timesheet for the current January 2026 pay period.
   - Click **Populate Days**.
   - **Verify UX**: Ensure only the specific row shows a loading spinner, and the rest of the table remains interactive.

---

## Regression Flow 3: Payroll Verification
**Objective:** Verify accurate payroll calculations using complex seeded scenarios.

1. **Pay Period Validation:**
   - Navigate to `/admin/payroll`.
   - Use the seeded **January 2026** pay period (01-01 to 01-31).
2. **Payslip Generation:**
   - Go to **Payslips** tab.
   - Click **Generate Payslips**.
   - Verify seeded employees have non-zero gross pay based on their compensation and the 15 days of seeded time events.
3. **Export Verification:**
   - Open a payslip and click **Download PDF**.
   - Verify all calculations (Regular Pay, Deductions, Net Pay) match the UI.

---

## Regression Flow 4: User Management & Security
**Objective:** Verify RBAC and session security.

1. **RBAC Enforcement:**
   - Log in as a regular `ADMIN`.
   - Attempt to access `/super-admin/dashboard`.
   - Verify access is denied and user is redirected to `/dashboard`.
2. **Prevention of Double Submission:**
   - Navigate to `/admin/employee`.
   - Click **Add Employee**.
   - Rapidly click **Create Employee** twice.
   - Verify that the button disables immediately and only **one** employee is created.

---

## Quick Regression Checklist
| Flow | Method | Status | Notes |
| :--- | :--- | :--- | :--- |
| Database Reset | `npm run db:reset` | [ ] | Schema clean and seeded |
| Super Admin Login | `superadmin@example.com` | [ ] | |
| Tenant Isolation | Check Acme vs Tech | [ ] | |
| Row-Level Loading | Populate Days | [ ] | Improved Table UX |
| Double Click Fix | Employee Create | [ ] | Prevents duplicate data |
| Payroll Calc | Jan 2026 Period | [ ] | Seeded events process correctly |
| PDF Export | Check branding/data | [ ] | |

