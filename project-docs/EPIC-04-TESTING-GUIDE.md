# Epic 4: Timesheet Management - Testing Guide

Use this guide to verify the **complete** Timesheet Generation and Management feature, including the new adjustment workflow and raw events display.

## 🏁 Prerequisites

Ensure both servers are running:

1. **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2. **Frontend**: `cd frontend && npm run dev`
3. **Admin URL**: [http://localhost:3001/timesheet](http://localhost:3001/timesheet)

### Test Data Requirements
- **Admin Account**: `admin@example.com` / `Admin123!`
- **Pay Period**: At least one pay period in the database
- **Time Events**: Clock-in/out data from Epic 3 testing

---

## 🧪 UI Testing Scenarios

### 1. Generate & Populate Timesheets

**Navigate to**: `/timesheet`

**Steps**:
1. Click **"Generate Timesheets"** button
2. Select a pay period from the dropdown
3. Click "Generate"
4. Verify timesheets appear in the table with status `DRAFT`
5. Click **"Populate Days"** action on a timesheet row
6. Refresh and verify the timesheet now has computed hours

**Expected**:
- One timesheet per active employee
- Daily entries show hours worked
- Anomaly warnings appear if there are missing clock-outs

---

### 2. View Timesheet Details

**Navigate to**: Click any timesheet row → `/timesheet/[id]`

**Steps**:
1. Verify the **"Daily Entries"** tab shows:
   - Date, regular hours, break hours, overtime
   - Total hours per day
   - Anomaly indicators (⚠️) if present
   - "Adjust" button on each row (if not LOCKED)

2. Click **"Raw Events"** tab
3. Verify raw time events display with:
   - Date and time
   - Event type (CLOCK_IN, CLOCK_OUT, BREAK_IN, BREAK_OUT)
   - Source badge (KIOSK, WEB, MOBILE)

**Expected**:
- Tabs switch correctly
- Raw events match the aggregated daily entries
- Anomalies are clearly marked

---

### 3. Create Time Adjustment

**Navigate to**: Timesheet detail page → Daily Entries tab

**Steps**:
1. Click **"Adjust"** button on any day
2. Dialog opens showing current values
3. Select field to adjust: **Regular Minutes**
4. Select mode: **Add/Subtract (DELTA)**
5. Enter minutes: `30`
6. Enter reason: "Employee worked during lunch break"
7. Click **"Save Adjustment"**

**Expected**:
- Dialog closes
- Toast notification: "Adjustment saved"
- Page refreshes automatically
- Hours update in the table (+30 minutes = +0.5h)

**Try**: Change mode to **"Set Value (OVERRIDE)"** and set absolute minutes

---

### 4. View Anomalies

**Navigate to**: Timesheet detail page with anomalies

**Steps**:
1. Find a day with ⚠️ anomaly icon
2. Hover over the icon
3. Verify tooltip shows anomaly details (e.g., "Missing CLOCK_OUT")

**Expected**:
- Clear visual indicator (amber color)
- Count shows number of anomalies
- Tooltip reveals specific issues

---

### 5. Status Workflow

**Navigate to**: `/timesheet`

**Steps**:
1. Click dropdown menu (⋮) on a `DRAFT` timesheet
2. Select **"Mark as Reviewed"**
3. Verify status badge changes to `REVIEWED`
4. Click dropdown again
5. Select **"Approve"**
6. Verify status changes to `APPROVED`
7. Select **"Lock"**
8. Verify status is now `LOCKED` (red badge)
9. Try to adjust a day → Button should be disabled

**Expected**:
- Status transitions: DRAFT → REVIEWED → APPROVED → LOCKED
- Actions are context-aware (no "Approve" on DRAFT)
- Locked timesheets cannot be adjusted

---

## 🔌 API Testing (httpyac)

Use `backend/httpyac/timesheet.http`:

### New Endpoints

```http
### Get raw time events for timesheet
GET {{API_BASE_URL}}/timesheets/1/events
Authorization: Bearer {{adminLogin.accessToken}}

### Create adjustment (add 30 mins)
POST {{API_BASE_URL}}/timesheets/days/1/adjustments
Content-Type: application/json

{
  "field": "REGULAR",
  "mode": "DELTA",
  "deltaMinutes": 30,
  "reason": "Employee worked during lunch, adding 30 minutes."
}

### Get adjustment history for a day
GET {{API_BASE_URL}}/timesheets/days/1/adjustments
Authorization: Bearer {{adminLogin.accessToken}}
```

---

## ✅ Verification Checklist

| Feature | Status |
|---------|--------|
| Generate timesheets for pay period | [ ] |
| Populate days from time events | [ ] |
| View timesheet detail page | [ ] |
| Switch between Daily Entries & Raw Events tabs | [ ] |
| Create adjustment via dialog | [ ] |
| Adjustment updates hours correctly | [ ] |
| Anomalies display with warning icons | [ ] |
| Status workflow (DRAFT → LOCKED) | [ ] |
| Locked timesheets prevent adjustments | [ ] |
| API endpoints return correct data | [ ] |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No timesheets appear | Ensure pay periods exist in DB |
| Populate fails | Verify time events exist for employee in period |
| Adjustment dialog won't open | Check timesheet is not LOCKED |
| Raw events tab empty | Run populate first, or add time events |
| Toast not showing | Check browser console for errors |

---

Happy Testing! 📊 All Epic 4 features are now complete.
