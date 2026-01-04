# Epic 6: Dynamic Admin Dashboard - Testing Guide

Use this guide to verify the **Dynamic Admin Dashboard** feature.

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
  - Four stat cards display:
    - ✅ **Total Employees**: Shows count of active employees
    - ✅ **Attendance Today**: Shows percentage (e.g., "85%")
    - ✅ **Pending Approvals**: Shows count of pending timesheets + payslips
    - ✅ **Present Today**: Shows ratio (e.g., "17/20")
  - Loading indicator should appear briefly
  - Two placeholder sections for future charts/activity feed

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

### Feature 3: Loading States

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
| **Stats Display Correctly** | All 4 cards show numeric values, not "undefined" or "0" |
| **Attendance % Accurate** | Matches manual calculation from database |
| **Pending Count Correct** | Sum of pending timesheets + payslips |
| **Refresh Button Works** | Clicking button fetches fresh data |
| **Loading State Shows** | Spinner appears during initial load |
| **Error Handling Works** | Graceful error message when backend offline |
| **Responsive Design** | Dashboard looks good on mobile, tablet, desktop |
| **API Endpoint Protected** | Returns 401 without valid JWT token |

---

## ✅ Test Checklist

- [ ] Dashboard loads successfully with all stat cards
- [ ] Total Employees count matches database
- [ ] Attendance Today percentage is accurate
- [ ] Pending Approvals count is correct
- [ ] Present Today shows correct ratio
- [ ] Refresh button updates stats
- [ ] Loading state appears on initial load
- [ ] Error state displays when backend is offline
- [ ] Retry button recovers from errors
- [ ] API endpoint `/dashboard/stats` returns valid JSON
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

---

Happy Testing! 📊✨
