# TimeSlip-HR Comprehensive Testing Guide

This guide provides step-by-step instructions to test all features across all 9 Epics of the TimeSlip-HR system.

## Prerequisites

Before testing, ensure you have:

1. **Backend running** on `http://localhost:3001`
   ```bash
   cd backend
   pnpm start:dev
   ```

2. **Frontend running** on `http://localhost:3000`
   ```bash
   cd frontend
   pnpm dev
   ```

3. **Database seeded** with test data
   ```bash
   cd backend
   pnpm seed
   ```

4. **Test Credentials:**
   - **Admin:** `admin@example.com` / `password123`
   - **Employee:** Use employee number from seeded data (e.g., `1001001`)

---

## Epic 1: Foundations Testing

### 1.1 Backend Health Check
- [ ] Navigate to `http://localhost:3001/api/docs` → Swagger UI should load
- [ ] Verify all API endpoints are listed and categorized

### 1.2 Frontend Health Check
- [ ] Navigate to `http://localhost:3000` → Landing page should load
- [ ] Verify routing works: try `/sign-in`, `/kiosk`

### 1.3 Database Connection
- [ ] Run `pnpm migration:show` in backend → Should show all migrations as "applied"

---

## Epic 2: Authentication & User Management Testing

### 2.1 Admin Login
- [ ] Go to `http://localhost:3000/sign-in`
- [ ] Enter admin credentials: `admin@example.com` / `password123`
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Check that JWT token is stored in localStorage

### 2.2 RBAC Protection
- [ ] While logged in as admin, access `/admin/employee` → Should work
- [ ] Log out, try accessing `/admin/employee` directly → Should redirect to sign-in

### 2.3 Employee CRUD
- [ ] Navigate to `/admin/employee`
- [ ] Click **Add Employee** → Fill form → Save
- [ ] Verify new employee appears in list
- [ ] Click **Edit** on an employee → Change a field → Save
- [ ] Toggle employee status to **Inactive** → Save
- [ ] Verify inactive employee is marked appropriately

### 2.4 Token Refresh
- [ ] Stay logged in for 15+ minutes (or modify JWT_ACCESS_EXPIRATION to 1m for testing)
- [ ] Make an API call → Should succeed (token auto-refreshes)

---

## Epic 3: Employee Time Logging Testing

### 3.1 Kiosk Access
- [ ] Navigate to `http://localhost:3000/kiosk`
- [ ] Verify analog clock displays and updates

### 3.2 Clock In Flow
- [ ] Enter employee number (e.g., `1001001`)
- [ ] Enter PIN if required
- [ ] Click **Clock In**
- [ ] Verify success toast: "Clock In successful at HH:MM"
- [ ] Verify status changes to "CLOCKED_IN"

### 3.3 Break Flow
- [ ] While clocked in, click **Break In**
- [ ] Verify status changes to "ON_BREAK"
- [ ] Click **Break Out**
- [ ] Verify status returns to "CLOCKED_IN"

### 3.4 Clock Out Flow
- [ ] Click **Clock Out**
- [ ] Verify success toast with total hours worked
- [ ] Verify status changes to "CLOCKED_OUT"

### 3.5 Invalid Sequence Prevention
- [ ] Try to **Clock In** while already clocked in → Should show error
- [ ] Try to **Break Out** without **Break In** → Should show error
- [ ] Try to **Clock Out** while on break → Should show error (or auto-end break)

### 3.6 Recent Activity
- [ ] Verify recent events appear at the bottom of the kiosk page

---

## Epic 4: Timesheet Management Testing

### 4.1 Generate Timesheets
- [ ] Log in as admin
- [ ] Navigate to `/admin/timesheet`
- [ ] Click **Generate Timesheets**
- [ ] Select a pay period
- [ ] Click **Generate**
- [ ] Verify timesheets are created for employees with time events

### 4.2 View Timesheet Details
- [ ] Click on a timesheet row
- [ ] Verify daily breakdown is shown
- [ ] Verify hours calculated (regular, break, overtime)

### 4.3 Timesheet Adjustment
- [ ] Click **Adjust** on a timesheet day
- [ ] Select field to adjust (Regular, Break, or Overtime)
- [ ] Enter adjustment amount and reason (min 10 characters)
- [ ] Click **Save Adjustment**
- [ ] Verify adjusted values are reflected
- [ ] Verify adjustment appears in history

### 4.4 Status Workflow
- [ ] Change timesheet status from **DRAFT** to **REVIEWED**
- [ ] Change from **REVIEWED** to **APPROVED**
- [ ] Change from **APPROVED** to **LOCKED**
- [ ] Verify locked timesheets cannot be adjusted

### 4.5 Anomaly Detection
- [ ] Find a timesheet with anomalies (missing clock-out, long break)
- [ ] Verify anomaly badges are displayed
- [ ] Use **Quick Fix** if available

---

## Epic 5: Payroll & Payslips Testing

### 5.1 Pay Period Management
- [ ] Navigate to `/admin/payroll` → **Pay Periods** tab
- [ ] Click **Create Pay Period**
- [ ] Select type (Weekly, Bi-Weekly, Semi-Monthly, Monthly)
- [ ] Set dates and create
- [ ] Verify pay period appears in list

### 5.2 Payslip Generation
- [ ] Go to **Payslips** tab
- [ ] Click **Generate Payslips**
- [ ] Select pay period
- [ ] Click **Generate**
- [ ] Verify payslips are created for employees with approved timesheets

### 5.3 View Payslip Details
- [ ] Click on a payslip row
- [ ] Verify breakdown shows:
  - Employee info
  - Hours (regular, overtime)
  - Gross pay calculation
  - Deductions
  - Net pay

### 5.4 PDF Download
- [ ] Click **Download PDF** on a payslip
- [ ] Verify PDF downloads with correct formatting
- [ ] Verify company info, employee info, pay breakdown visible

### 5.5 Bulk Export
- [ ] Select multiple payslips using checkboxes
- [ ] Click **Bulk Download**
- [ ] Verify ZIP file downloads with multiple PDFs

### 5.6 Payslip Finalization
- [ ] Click **Finalize** on a DRAFT payslip
- [ ] Verify status changes to **FINALIZED**
- [ ] Verify finalized payslips cannot be modified

### 5.7 Deduction Management
- [ ] Go to **Deductions** tab (if available)
- [ ] Create a new deduction (e.g., "Health Insurance - Fixed - 500")
- [ ] Verify deduction is applied to next payslip generation

### 5.8 Employee Portal Payslips
- [ ] Log in as an employee (via portal)
- [ ] Navigate to `/portal/payslips`
- [ ] Verify employee can see their own payslips
- [ ] Download PDF and verify contents

---

## Epic 6: Admin Dashboard Testing

### 6.1 Dashboard Widgets
- [ ] Navigate to `/admin/dashboard`
- [ ] Verify widgets display:
  - Total Employees count
  - Attendance Today (percentage)
  - Currently Clocked In count
  - On Break count
  - Pending Approvals count

### 6.2 Real-time Data
- [ ] Have someone clock in via kiosk
- [ ] Click **Refresh** on dashboard
- [ ] Verify "Currently Clocked In" increases

### 6.3 Recent Activity Feed
- [ ] Verify recent time events are displayed
- [ ] Verify event type, employee name, and timestamp shown

### 6.4 Timesheet Export
- [ ] Navigate to `/admin/reports`
- [ ] Click **Generate Export** under Timesheet Export
- [ ] Select date range and filters
- [ ] Click **Export**
- [ ] Verify CSV downloads with correct data

### 6.5 Attendance Summary Report
- [ ] Click **Generate Report** under Attendance Summary
- [ ] Select date range
- [ ] Click **Generate**
- [ ] Verify CSV includes daily totals and anomalies

---

## Epic 7: System Settings Testing

### 7.1 General Settings
- [ ] Navigate to `/admin/settings`
- [ ] Go to **General** tab
- [ ] Change company name → Save
- [ ] Verify changes persist on refresh

### 7.2 Payroll Policies
- [ ] Go to **Payroll Policies** tab
- [ ] Modify:
  - Standard daily hours
  - Overtime threshold
  - Overtime multiplier
  - Break duration requirements
- [ ] Save and verify persistence

### 7.3 Security Settings
- [ ] Go to **Security & Compliance** tab
- [ ] Modify:
  - Password minimum length
  - Session timeout duration
  - PIN requirements for kiosk
- [ ] Save and verify changes

---

## Epic 8: Quality & Security Testing

### 8.1 Backend Unit Tests
```bash
cd backend
pnpm test
```
- [ ] Verify all tests pass
- [ ] Check coverage: `pnpm test:cov`

### 8.2 Frontend Tests
```bash
cd frontend
pnpm test
```
- [ ] Verify all tests pass

### 8.3 Role-Based Access Control
- [ ] Log in as admin → Access all admin routes ✓
- [ ] Log in as employee → Attempt admin route → Should be denied
- [ ] Test API endpoints with wrong role token → Should return 403

### 8.4 Audit Logging
- [ ] Make a timesheet adjustment
- [ ] Check audit log (via API or DB) for the entry
- [ ] Verify log contains: user, action, entity, timestamp, changes

### 8.5 Input Validation
- [ ] Try submitting forms with:
  - Empty required fields → Should show validation error
  - Invalid email format → Should show error
  - Negative numbers for hours → Should be rejected

---

## Epic 9: UX & Documentation Testing

### 9.1 Loading States
- [ ] Slow network simulation (Chrome DevTools → Slow 3G)
- [ ] Verify loading skeletons/spinners appear during data fetch

### 9.2 Error States
- [ ] Stop backend server
- [ ] Try to load admin pages → Verify error message shown
- [ ] Restart backend → Click "Retry" → Should recover

### 9.3 Empty States
- [ ] View timesheet page with no data → Verify empty state message
- [ ] View payslip page with no payslips → Verify friendly message

### 9.4 Documentation Accessibility
- [ ] Open `ADMIN_GUIDE.md` → Verify content is comprehensive
- [ ] Open `EMPLOYEE_GUIDE.md` → Verify employee workflows clear
- [ ] Open `DEVELOPER_README.md` → Follow setup steps

---

## Quick Smoke Test Checklist

Use this for rapid validation after deployments:

```
[ ] Admin login works
[ ] Dashboard loads with real data
[ ] Employee list loads
[ ] Kiosk clock in/out works
[ ] Timesheet generation works
[ ] Payslip generation works
[ ] PDF download works
[ ] Settings save works
[ ] Reports export works
```

---

## Test Data Reset

To reset test data and start fresh:

```bash
cd backend
pnpm migration:revert  # Revert migrations
pnpm migration:run     # Reapply migrations
pnpm seed              # Re-seed data
```

---

## Reporting Issues

When reporting test failures, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/environment details
5. Console errors (if any)
6. Network requests (from DevTools)

---

*Last Updated: January 2026*
