# Epic 6: Admin Dashboard and Reporting - Testing Guide

Use this guide to verify the **Enhanced Admin Dashboard** and **Reports & Exports** features.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1. **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2. **Frontend**: `cd frontend && npm run dev`
3. **Admin URL**: Open [http://localhost:3001/admin/dashboard](http://localhost:3001/admin/dashboard)

---

## 👤 Test Account Info

You need:
- **Admin Account**: Log in with admin credentials (e.g., `admin@example.com` / `Admin123!`)
- **Active Employees**: At least a few active employees in the database
- **Time Events**: Some employees should have clocked in today
- **Timesheets**: Some timesheets in DRAFT or REVIEWED status
- **Payslips**: Some payslips in DRAFT status

> [!TIP]
> Run the database seeder to create test data: `npm run seed`

---

## 🧪 Test Scenarios

### Feature 1: Dashboard Stats Display

#### 1.1 View Dashboard on Fresh Login
- **Action**: Login as admin, navigate to `/admin/dashboard`.
- **Expected**: 
  - Dashboard loads without errors
  - Six stat cards display:
    - ✅ **Total Employees**: Shows count of active employees
    - ✅ **Attendance Today**: Shows percentage (e.g., "85%")
    - ✅ **Pending Approvals**: Shows count of pending timesheets + payslips
    - ✅ **Present Today**: Shows ratio (e.g., "17/20")
    - ✅ **Currently Clocked In**: Shows count of employees with active status
    - ✅ **On Break**: Shows count of employees currently on break
  - Loading indicator should appear briefly
  - Recent activity feed shows last 10 time events

#### 1.2 Verify Total Employees Count
- **Action**: Query database: `SELECT COUNT(*) FROM employees WHERE is_active = true AND company_id = 1;`
- **Expected**: 
  - Dashboard "Total Employees" matches database count

#### 1.3 Verify Attendance Today
- **Action**: 
  1. Note the current attendance percentage
  2. Have an employee clock in via `/kiosk`
  3. Refresh the dashboard
- **Expected**: 
  - Attendance percentage increases
  - "Present Today" count increments

#### 1.4 Verify Pending Approvals
- **Action**: 
  1. Query pending timesheets: `SELECT COUNT(*) FROM timesheets WHERE status IN ('DRAFT', 'REVIEWED') AND company_id = 1;`
  2. Query pending payslips: `SELECT COUNT(*) FROM payslips WHERE status = 'DRAFT' AND company_id = 1;`
  3. Sum the counts
- **Expected**: 
  - Dashboard "Pending Approvals" matches database total

#### 1.5 Verify Currently Clocked In
- **Action**: 
  1. Query currently clocked in employees:
  ```sql
  SELECT COUNT(DISTINCT te.employee_id) 
  FROM time_events te
  JOIN employees e ON te.employee_id = e.id
  WHERE e.company_id = 1 
    AND e.is_active = true
    AND te.type = 'CLOCK_IN'
    AND DATE(te.happened_at) = CURRENT_DATE
    AND NOT EXISTS (
      SELECT 1 FROM time_events te2 
      WHERE te2.employee_id = te.employee_id 
        AND te2.type = 'CLOCK_OUT' 
        AND te2.happened_at > te.happened_at
        AND DATE(te2.happened_at) = CURRENT_DATE
    );
  ```
- **Expected**: 
  - Dashboard "Currently Clocked In" matches database count

#### 1.6 Verify On Break Count
- **Action**: 
  1. Query employees on break:
  ```sql
  SELECT COUNT(DISTINCT te.employee_id) 
  FROM time_events te
  JOIN employees e ON te.employee_id = e.id
  WHERE e.company_id = 1 
    AND e.is_active = true
    AND te.type = 'BREAK_IN'
    AND DATE(te.happened_at) = CURRENT_DATE
    AND NOT EXISTS (
      SELECT 1 FROM time_events te2 
      WHERE te2.employee_id = te.employee_id 
        AND te2.type = 'BREAK_OUT' 
        AND te2.happened_at > te.happened_at
        AND DATE(te2.happened_at) = CURRENT_DATE
    );
  ```
- **Expected**: 
  - Dashboard "On Break" matches database count

#### 1.7 Verify Recent Activity Feed
- **Action**: 
  1. Check the Recent Activity section on dashboard
  2. Perform a time event (clock in/out via kiosk)
  3. Refresh dashboard
- **Expected**: 
  - Recent activity shows last 10 time events
  - Events display employee name, event type, and timestamp
  - Events are ordered by most recent first
  - New event appears at the top after refresh

---

### Feature 2: Refresh Functionality

#### 2.1 Manual Refresh
- **Action**: Click the "Refresh" button in the top-right corner
- **Expected**: 
  - Button shows loading spinner
  - Stats update with latest data
  - Button returns to normal state

#### 2.2 Refresh After Data Changes
- **Action**: 
  1. Note current stats
  2. Add a new employee via `/admin/employees`
  3. Click "Refresh" on dashboard
- **Expected**: 
  - "Total Employees" count increases by 1

---

### Feature 3: Frontend Dashboard UI

#### 3.1 Verify New Stat Cards Display
- **Action**: 
  1. Login as admin and navigate to `/admin/dashboard`
  2. Observe all 6 stat cards
- **Expected**: 
  - "Total Employees" card displays
  - "Attendance Today" shows percentage
  - "Pending Approvals" shows count
  - "Present Today" shows ratio
  - **"Currently Clocked In"** card displays with teal icon (UserCheck)
  - **"On Break"** card displays with amber icon (Coffee)
  - All cards show numeric values, not "undefined"

#### 3.2 Verify Recent Activity Feed
- **Action**: 
  1. Check the "Recent Activity" section on dashboard
  2. Perform a time event (clock in via kiosk)
  3. Refresh the dashboard page
- **Expected**: 
  - Activity feed shows up to 10 most recent events
  - Each event displays:
    - Employee name
    - Event type (CLOCK_IN, CLOCK_OUT, BREAK_IN, BREAK_OUT)
    - Relative timestamp ("Just now", "5m ago", "2h ago")
  - Events have appropriate icons:
    - CLOCK_IN: Blue clock icon
    - CLOCK_OUT: Gray clock icon
    - BREAK_IN: Amber coffee icon
    - BREAK_OUT: Gray coffee icon
  - New event appears at the top after refresh
  - Empty state shows "No recent activity" when no events

#### 3.3 Verify Auto-Refresh
- **Action**: 
  1. Open dashboard and note current stats
  2. Wait 5 minutes (or modify REFRESH_INTERVAL constant for testing)
  3. Have another employee clock in during wait time
- **Expected**: 
  - Dashboard automatically refreshes after 5 minutes
  - Stats update without manual refresh button click
  - No page reload, only data update

#### 3.4 Responsive Design
- **Action**: Resize browser window to mobile, tablet, and desktop sizes
- **Expected**: 
  - Stat cards reflow appropriately:
    - Mobile: 1 column
    - Tablet: 2 columns  
    - Desktop: 3 columns (6 cards total)
  - Recent activity feed remains readable on all sizes
  - No horizontal scrolling required

---

### Feature 4: Reports Page UI

#### 4.1 Access Reports Page
- **Action**: Navigate to `/admin/reports`
- **Expected**: 
  - Page loads successfully
  - Title: "Reports & Exports"
  - Description: "Generate and download CSV reports..."
  - Two report cards visible:
    - "Timesheet Export" with blue FileText icon
    - "Attendance Summary" with green Calendar icon
  - Each card has "Generate Export"/"Generate Report" button

#### 4.2 Last Export Date Display
- **Action**: 
  1. Generate any report (timesheet or attendance)
  2. Return to reports page
- **Expected**: 
  - Both cards show "Last export: [timestamp]" at bottom
  - Timestamp is in local format (e.g., "1/6/2026, 8:50:00 PM")

---

### Feature 5: Timesheet Export Dialog

#### 5.1 Open Timesheet Export Dialog
- **Action**: Click "Generate Export" on Timesheet Export card
- **Expected**: 
  - Dialog opens with title "Export Timesheets"
  - Form fields visible:
    - Status dropdown (optional)
    - Sort By dropdown (default: "Employee Name")
    - Sort Order radio buttons (default: "Ascending")
  - "Cancel" and "Export CSV" buttons at bottom

#### 5.2 Test Status Filter
- **Action**: 
  1. Open dialog
  2. Select "APPROVED" from Status dropdown
  3. Click "Export CSV"
- **Expected**: 
  - CSV file downloads automatically
  - Filename format: `timesheets-YYYY-MM-DD.csv`
  - CSV only contains APPROVED timesheets
  - Dialog closes after successful export

#### 5.3 Test Sorting Options
- **Action**: 
  1. Set Sort By to "Total Hours"
  2. Set Sort Order to "Descending"
  3. Export
- **Expected**: 
  - CSV rows sorted by total hours, highest first

#### 5.4 Test Loading State
- **Action**: Click "Export CSV" and observe button
- **Expected**: 
  - Button shows loading spinner
  - Button text: "Export CSV" with spinning icon
  - Button disabled during export
  - Both buttons (Cancel & Export) disabled while loading

#### 5.5 Test Error Handling
- **Action**: 
  1. Stop backend server
  2. Try to export
- **Expected**: 
  - Error message displays in red box
  - Message: "Export failed" or similar
  - Dialog remains open
  - Can retry after fixing issue

---

### Feature 6: Attendance Summary Dialog

#### 6.1 Open Attendance Summary Dialog
- **Action**: Click "Generate Report" on Attendance Summary card
- **Expected**: 
  - Dialog opens with title "Generate Attendance Summary"
  - Form fields:
    - Start Date * (required, date input)
    - End Date * (required, date input)
    - "Include anomaly indicators" checkbox (checked by default)
    - Sort Order radio buttons (default: "Ascending")

#### 6.2 Test Date Validation
- **Action**: 
  1. Leave Start Date empty
  2. Try to click "Generate Report"
- **Expected**: 
  - Button is disabled when dates are empty
  - Cannot submit form without both dates

#### 6.3 Test Anomaly Toggle
- **Action**: 
  1. Fill in dates (e.g., last 7 days)
  2. Uncheck "Include anomaly indicators"
  3. Generate report
- **Expected**: 
  - CSV generated without anomaly indicators
  - Anomalies column may be empty or omitted

#### 6.4 Test Date Range Export
- **Action**: 
  1. Set Start Date: 2026-01-01
  2. Set End Date: 2026-01-07
  3. Check "Include anomaly indicators"
  4. Generate
- **Expected**: 
  - CSV downloads: `attendance-summary-YYYY-MM-DD.csv`
  - Data covers exactly 7 days (Jan 1-7)
  - Anomalies column populated with:
    - "Missing Clock Out"
    - "Excessive Hours (>12h)"
    - "No Break Recorded"

#### 6.5 Test Form Reset
- **Action**: 
  1. Fill form and generate report successfully
  2. Reopen dialog
- **Expected**: 
  - Form is reset to defaults:
    - Dates cleared
    - Anomalies checkbox checked
    - Sort order: Ascending

---

### Feature 7: CSV Download Functionality

#### 7.1 Verify File Download
- **Action**: Generate any report
- **Expected**: 
  - Browser triggers automatic download
  - No need to manually save
  - File appears in Downloads folder

#### 7.2 Verify CSV Format
- **Action**: 
  1. Download timesheet export
  2. Open in Excel or text editor
- **Expected**: 
  - Valid CSV format
  - Headers in first row
  - Data properly escaped (commas in names don't break columns)
  - No formatting issues

#### 7.3 Verify Filename Format
- **Action**: Generate multiple reports on same day
- **Expected**: 
  - Each file has unique timestamp in name
  - Format: `timesheets-2026-01-06.csv`
  - Format: `attendance-summary-2026-01-06.csv`

---

## Updated Testing Checklist

### Backend Features

#### 3.1 Initial Loading
- **Action**: 
  1. Clear browser cache
  2. Navigate to `/admin/dashboard`
  3. Observe loading behavior
- **Expected**: 
  - "Loading..." message appears briefly
  - "Fetching dashboard data..." subtitle shown
  - Stats cards appear after data loads

---

### Feature 4: Error Handling

#### 4.1 Backend Offline Error
- **Action**: 
  1. Stop the backend server
  2. Refresh dashboard page
- **Expected**: 
  - Error state displays
  - Red error message shown
  - "Retry" button appears
  - Click "Retry" shows loading state

#### 4.2 Network Error Recovery
- **Action**: 
  1. Restart backend server
  2. Click "Retry" button
- **Expected**: 
  - Dashboard recovers gracefully
  - Stats load successfully

---

## 🛠️ API Testing

### Using httpyac or REST Client

Use the provided `backend/httpyac/dashboard.http` file:

```http
### Admin Login
# @name adminLogin
POST {{API_BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "{{TEST_ADMIN_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

### Get Dashboard Stats
GET {{API_BASE_URL}}/dashboard/stats
Authorization: Bearer {{adminLogin.accessToken}}
```

#### Expected API Response:
```json
{
  "totalEmployees": 25,
  "attendanceToday": {
    "present": 18,
    "total": 25,
    "percentage": 72
  },
  "pendingApprovals": {
    "timesheets": 5,
    "payslips": 3
  }
}
```

---

## 🔍 Database Queries for Manual Verification

```sql
-- Check total active employees
SELECT COUNT(*) as total_employees
FROM employees 
WHERE is_active = true 
  AND company_id = 1;

-- Check attendance today (unique clock-ins)
SELECT COUNT(DISTINCT employee_id) as present_today
FROM time_events 
WHERE event_type = 'CLOCK_IN'
  AND DATE(timestamp) = CURRENT_DATE
  AND employee_id IN (SELECT id FROM employees WHERE company_id = 1);

-- Check pending timesheet approvals
SELECT COUNT(*) as pending_timesheets
FROM timesheets t
JOIN employees e ON t.employee_id = e.id
WHERE e.company_id = 1
  AND t.status IN ('DRAFT', 'REVIEWED');

-- Check pending payslip approvals
SELECT COUNT(*) as pending_payslips
FROM payslips p
JOIN employees e ON p.employee_id = e.id
WHERE e.company_id = 1
  AND p.status = 'DRAFT';

-- Verify attendance percentage calculation
SELECT 
  COUNT(DISTINCT te.employee_id) as present,
  (SELECT COUNT(*) FROM employees WHERE is_active = true AND company_id = 1) as total,
  ROUND(
    (COUNT(DISTINCT te.employee_id)::decimal / 
     (SELECT COUNT(*) FROM employees WHERE is_active = true AND company_id = 1)) * 100
  ) as percentage
FROM time_events te
JOIN employees e ON te.employee_id = e.id
WHERE te.event_type = 'CLOCK_IN'
  AND DATE(te.timestamp) = CURRENT_DATE
  AND e.company_id = 1;
```

---

## 🧩 Frontend Component Testing

### 1. StatCard Component
- **Location**: `frontend/components/admin/dashboard/StatCard.tsx`
- **Test**: Ensure each stat card renders with:
  - ✅ Correct icon (User, Clock, Calendar, TrendingUp)
  - ✅ Proper color scheme (blue, green, orange, purple)
  - ✅ Dynamic value (not hardcoded)
  - ✅ Responsive grid layout (4 columns on large screens, 2 on medium, 1 on mobile)

### 2. useDashboardStats Hook
- **Location**: `frontend/hooks/use-dashboard-stats.ts`
- **Test**: Verify hook returns:
  - ✅ `stats` object with correct shape
  - ✅ `loading` boolean state
  - ✅ `error` string or null
  - ✅ `refetch` function that triggers data reload

---

## 📊 Verification Checklist

| Check | How to Verify |
|-------|---------------|
| **Stats Display Correctly** | All 6 cards show numeric values, not "undefined" or "0" |
| **Attendance % Accurate** | Matches manual calculation from database |
| **Pending Count Correct** | Sum of pending timesheets + payslips |
| **Currently Clocked In Accurate** | Matches employees with CLOCK_IN but no CLOCK_OUT today |
| **On Break Count Accurate** | Matches employees with BREAK_IN but no BREAK_OUT today |
| **Recent Activity Updates** | Shows last 10 events, updates on refresh |
| **Refresh Button Works** | Clicking button fetches fresh data |
| **Loading State Shows** | Spinner appears during initial load |
| **Error Handling Works** | Graceful error message when backend offline |
| **Responsive Design** | Dashboard looks good on mobile, tablet, desktop |
| **API Endpoint Protected** | Returns 401 without valid JWT token |

---

## ✅ Test Checklist

- [ ] Dashboard loads successfully with all 6 stat cards
- [ ] Total Employees count matches database
- [ ] Attendance Today percentage is accurate
- [ ] Pending Approvals count is correct
- [ ] Present Today shows correct ratio
- [ ] Currently Clocked In count is accurate
- [ ] On Break count is accurate
- [ ] Recent Activity feed displays last 10 events
- [ ] Recent Activity updates on refresh
- [ ] Refresh button updates stats
- [ ] Loading state appears on initial load
- [ ] Error state displays when backend is offline
- [ ] Retry button recovers from errors
- [ ] API endpoint `/dashboard/stats` returns valid JSON with new fields
- [ ] API endpoint `/dashboard/currently-active` returns employee details
- [ ] Stats update when underlying data changes
- [ ] Dashboard is responsive on all screen sizes
- [ ] No console errors or warnings
- [ ] Redux state updates correctly in DevTools

---

## 🐛 Common Issues & Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Stats show as 0 | No seeded data | Run `npm run seed` in backend |
| Attendance always 0% | No clock-ins today | Clock in an employee via kiosk |
| API returns 401 | Invalid JWT token | Re-login to refresh token |
| Dashboard blank | Frontend not connected to backend | Check API_URL in frontend `.env.local` |
| Stats not updating | Redux state not updating | Check browser Redux DevTools |
| Loading forever | Backend not running | Start backend with `npm run start:dev` |
| Recent activity empty | No time events today | Create events via kiosk |
| Currently clocked in is 0 | No active clock-ins | Clock in employees without clocking out |

---

## 📝 New Feature: Reports & Exports

### Feature 4: Timesheet Export

#### 4.1 Export All Timesheets
- **Action**: 
  1. Use REST client or httpyac to POST `/reports/timesheet-export`
  2. Body: `{ "startDate": "2026-01-01", "endDate": "2026-01-31" }`
- **Expected**: 
  - Returns CSV content with headers
  - Contains columns: Employee ID, Employee Name, Department, Pay Period, Status, Total Hours, Regular Hours, Overtime Hours, Created At
  - Data matches timesheets in database for the date range

#### 4.2 Export Filtered by Status
- **Action**: 
  1. POST `/reports/timesheet-export`
  2. Body: `{ "startDate": "2026-01-01", "endDate": "2026-01-31", "status": "APPROVED" }`
- **Expected**: 
  - CSV only contains APPROVED timesheets
  - Count matches database query with status filter

#### 4.3 Export with Sorting
- **Action**: 
  1. POST `/reports/timesheet-export`
  2. Body: `{ "sortBy": "employeeName", "sortOrder": "desc" }`
- **Expected**: 
  - CSV rows sorted by employee name in descending order

---

### Feature 5: Attendance Summary Report

#### 5.1 Generate Weekly Summary
- **Action**: 
  1. POST `/reports/attendance-summary`
  2. Body: `{ "startDate": "2026-01-01", "endDate": "2026-01-07", "includeAnomalies": true }`
- **Expected**: 
  - CSV with columns: Date, Employee ID, Employee Name, Department, Clock In, Clock Out, Total Hours, Break Duration, Anomalies
  - Anomalies column flags: "Missing Clock Out", "Excessive Hours (>12h)", "No Break Recorded"
  - One row per employee per day (only days with activity)

#### 5.2 Verify Anomaly Detection
- **Action**: 
  1. Create scenario: Employee clocks in but never clocks out
  2. Generate attendance summary for that day
- **Expected**: 
  - CSV row shows "Missing Clock Out" in Anomalies column
  - Total Hours is 0 or N/A

#### 5.3 Verify Excessive Hours Detection
- **Action**: 
  1. Create scenario: Employee works 14 hours in one day
  2. Generate attendance summary
- **Expected**: 
  - CSV row shows "Excessive Hours (>12h)" in Anomalies column

#### 5.4 Verify No Break Detection
- **Action**: 
  1. Create scenario: Employee works 8 hours with no break
  2. Generate attendance summary
- **Expected**: 
  - CSV row shows "No Break Recorded" in Anomalies column

---

### API Testing Examples

Create `backend/httpyac/reports.http` file:

```http
### Admin Login
# @name adminLogin
POST {{API_BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "{{TEST_ADMIN_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

### Export All Timesheets
POST {{API_BASE_URL}}/reports/timesheet-export
Authorization: Bearer {{adminLogin.response.body.accessToken}}
Content-Type: application/json

{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "sortBy": "employeeName",
  "sortOrder": "asc"
}

### Export Approved Timesheets Only
POST {{API_BASE_URL}}/reports/timesheet-export
Authorization: Bearer {{adminLogin.response.body.accessToken}}
Content-Type: application/json

{
  "status": "APPROVED",
  "sortBy": "totalHours",
  "sortOrder": "desc"
}

### Generate Attendance Summary
POST {{API_BASE_URL}}/reports/attendance-summary
Authorization: Bearer {{adminLogin.response.body.accessToken}}
Content-Type: application/json

{
  "startDate": "2026-01-01",
  "endDate": "2026-01-07",
  "includeAnomalies": true,
  "sortOrder": "asc"
}

### Get Currently Active Employees
GET {{API_BASE_URL}}/dashboard/currently-active
Authorization: Bearer {{adminLogin.response.body.accessToken}}
```

---

## Updated Test Checklist

### Dashboard Features
- [ ] All 6 stat cards display correctly
- [ ] Currently Clocked In matches database query
- [ ] On Break count is accurate
- [ ] Recent Activity shows last 10 events with employee names
- [ ] Activity feed updates when new time events occur
- [ ] `/dashboard/currently-active` endpoint returns detailed employee list

### Frontend Features
- [ ] All 6 stat cards display correctly
- [ ] Currently Clocked In card shows correct count
- [ ] On Break card shows correct count
- [ ] Recent Activity feed displays last 10 events
- [ ] Activity feed shows relative timestamps ("5m ago")
- [ ] Activity feed has correct icons for each event type
- [ ] Activity feed updates when new events occur
- [ ] Auto-refresh works every 5 minutes
- [ ] Dashboard responsive design works (mobile/tablet/desktop)
- [ ] Reports page loads at `/admin/reports`
- [ ] Timesheet Export dialog opens and closes
- [ ] Attendance Summary dialog opens and closes
- [ ] Timesheet export filters work (status, sort)
- [ ] Attendance date validation prevents empty dates
- [ ] CSV files download automatically
- [ ] CSV filenames follow format: `report-name-YYYY-MM-DD.csv`
- [ ] Loading states show spinners during export
- [ ] Error messages display on failed exports
- [ ] Forms reset after successful export
- [ ] Last export date displays on reports page

### Reports Features
- [ ] Timesheet export generates valid CSV
- [ ] CSV headers match specification
- [ ] Filter by status works correctly
- [ ] Filter by date range works correctly
- [ ] Sorting by employee name works (asc/desc)
- [ ] Sorting by total hours works
- [ ] Attendance summary generates valid CSV
- [ ] Anomaly detection flags missing clock-outs
- [ ] Anomaly detection flags excessive hours (>12h)
- [ ] Anomaly detection flags no breaks (>6h work)
- [ ] CSV escaping works (commas, quotes in employee names)
- [ ] Empty result sets return CSV with headers only
- [ ] Large datasets (100+ rows) export successfully

---

Happy Testing! 📊✨
