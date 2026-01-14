# TimeSlip-HR Regression Testing Guide

This guide outlines the critical end-to-end flows that must be verified before any major release. It covers the complete lifecycle from system-wide administration to individual company payroll finalization.

## Regression Flow 0: Super Admin Global Operations
**Objective:** Verify that a Super Admin can manage the entire system and oversee all companies.

1. **Super Admin Login:**
   - Log in with `SUPER_ADMIN` credentials.
   - Verify redirect to `/super-admin/dashboard`.
   - Verify System Admin sidebar is present with "Global Stats", "Companies", and "System Settings".
2. **Global Analytics:**
   - Verify "Total Companies", "Total Users", and "Total Employees" display non-zero values (after seeding/activity).
3. **Company Management:**
   - Navigate to `/super-admin/companies`.
   - **Create**: Add a new company "Regression Test Organization".
   - **List**: Verify the new company appears in the table.
   - **Edit**: Rename the company and verify changes persist.
   - **Delete**: Delete a test company and verify it is removed from the active list.
4. **Security Isolation:**
   - Verify that the Super Admin can see statistics for ALL companies, not just one.

---

## Regression Flow 1: Company Onboarding
**Objective:** Verify that a new company can register and the primary admin can access the dashboard.

1. **Registration:**
   - Navigate to `/sign-up`.
   - Fill in Company Name (e.g., "Regression Test Corp"), Admin Name, Email, and Password.
   - Click **Sign Up**.
2. **First Login & Dashboard:**
   - Verify redirect to `/dashboard` (Note: `/admin/dashboard` is the internal path but resolves to `/dashboard`).
   - Verify Company Name appears in the header/settings.
   - Verify empty state widgets (Total Employees: 0, etc.).

---

## Regression Flow 2: Workforce Configuration
**Objective:** Verify that employees can be added with correct compensation and deductions.

1. **Add Department/Position (if applicable):**
   - Verify settings/configuration for workforce structure.
2. **Create Employee:**
   - Navigate to `/admin/employee`.
   - Click **Add Employee**.
   - Fill in details: Name, Employee ID (unique), Contact Info.
   - **Crucial:** Set Compensation (Hourly or Monthly Salary).
3. **Configure Deductions:**
   - Go to Employee Details or Payroll Settings.
   - Add a Fixed deduction (e.g., "Tax" - 1000).
   - Add a Percentage deduction (e.g., "Health" - 2%).
4. **Verification:**
   - Ensure employee appears in the active list.

---

## Regression Flow 3: Time & Attendance
**Objective:** Verify that the Kiosk works and data flows into Timesheets.

1. **Kiosk Activity:**
   - Navigate to `/kiosk`.
   - Enter Employee ID.
   - Perform: **Clock In**.
   - (Wait or simulate time) Perform: **Break In** -> **Break Out**.
   - Perform: **Clock Out**.
2. **Timesheet Generation:**
   - Navigate to `/admin/timesheet`.
   - Click **Generate Timesheets** for the current period.
   - Open the employee's timesheet.
   - Verify: Calculated Regular Hours, Break Time, and Overtime.
3. **Approval Flow:**
   - Change Status: `DRAFT` -> `REVIEWED` -> `APPROVED`.
   - Verify timesheet becomes read-only after `LOCKED` (or `APPROVED` depending on policy).

---

## Regression Flow 4: Payroll & Payslips
**Objective:** Verify that payroll calculates correctly and produces downloadable documents.

1. **Pay Period Setup:**
   - Navigate to `/admin/payroll`.
   - Create a new Pay Period (e.g., Semi-Monthly: 1st-15th).
2. **Payslip Generation:**
   - Go to **Payslips** tab.
   - Click **Generate Payslips** for the period.
   - Verify the newly created employee has a payslip.
3. **Calculation Verification:**
   - Open Payslip Details.
   - Check **Gross Pay** (Hours * Rate).
   - Check **Deductions** (Fixed + Percentage).
   - Check **Net Pay** (Gross - Deductions).
4. **Finalization & Export:**
   - Click **Finalize** on the payslip.
   - Click **Download PDF**.
   - Open PDF and verify company/employee branding and accurate numbers.
   - (Optional) Perform **Bulk Download** if multiple employees exist.

---

## Regression Flow 5: User Management & Security
**Objective:** Verify RBAC and session security.

1. **Super Admin Isolation:**
   - Log in as a regular `ADMIN`.
   - Attempt to access `/super-admin/dashboard` and `/super-admin/companies`.
   - Verify access is denied and user is redirected to `/dashboard`.
2. **Admin/Employee Access:**
   - Log in as an Employee.
   - Attempt to access `/dashboard` or `/super-admin/dashboard`.
   - Verify access is denied (Redirect to `/kiosk` or `/portal`).
3. **Password/Profile Management:**
   - Update Admin password/profile.
   - Logout and login with new credentials.

---

## Quick Regression Checklist
| Flow | Status | Notes |
| :--- | :--- | :--- |
| Super Admin Stats | [ ] | Global overview works |
| Company CRUD | [ ] | Super Admin can add/edit/delete |
| Registration | [ ] | |
| Add Employee | [ ] | |
| Kiosk Log | [ ] | |
| Generate Timesheet | [ ] | |
| Approve Timesheet | [ ] | |
| Generate Payslip | [ ] | |
| PDF Export | [ ] | |
| Admin Isolation | [ ] | Regular Admin cannot see Super Admin pages |
