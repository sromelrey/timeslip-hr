# Epic 4: Timesheet Management - Testing Guide

Use this guide to verify the **Timesheet Generation and Management** feature.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1.  **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2.  **Frontend**: `cd frontend && npm run dev`
3.  **Admin URL**: Open [http://localhost:3001/admin/timesheet](http://localhost:3001/admin/timesheet)

---

## 👤 Test Account Info

You need:
- **Admin Account**: Log in with admin credentials (e.g., `admin@example.com` / `Admin123!`)
- **Seeded Pay Period**: Ensure at least one Pay Period exists (check `pay_periods` table or run seeds)
- **Time Events**: Have some clock-in/out data from Epic 3 testing

> [!TIP]
> If no Pay Period exists, you can create one via database or add a seed script.

---

## 🧪 Test Scenarios

### 1. Generate Timesheets for a Pay Period
- **Action**: Navigate to **Timesheets** page, click **Generate Timesheets**.
- **Expected**: 
  - New `Timesheet` records appear in the table (one per active employee).
  - Status should be `DRAFT`.

### 2. Populate Timesheet Days (Aggregate Time Events)
- **Action**: Use `httpyac/timesheet.http` or call `POST /timesheets/:id/populate` with a valid timesheet ID.
- **Expected**: 
  - `TimesheetDay` records are created for each day with time events.
  - `regularMinutes` and `breakMinutes` calculated from clock/break pairs.
  - Anomalies (e.g., missing clock-out) flagged in `anomaliesJson`.

### 3. View Timesheet Details
- **Action**: Click on a timesheet row to view details (if detail page exists), or call `GET /timesheets/:id`.
- **Expected**: 
  - Response includes `days` array with per-day breakdown.
  - Employee and Pay Period info populated.

### 4. Update Timesheet Status (Workflow)
- **Action**: Use `PATCH /timesheets/:id/status` with body `{ "status": "REVIEWED" }`.
- **Expected**: 
  - Timesheet status changes to `REVIEWED`.
  - `reviewedAt` timestamp populated.

- **Action**: Update status to `APPROVED`.
- **Expected**: 
  - Status changes to `APPROVED`.
  - `approvedAt` timestamp populated.

---

## 🛠️ Verification & Troubleshooting

| Check | How |
|-------|-----|
| **Timesheet Created** | Query `timesheets` table for new records |
| **Days Populated** | Query `timesheet_days` table for `timesheetId` |
| **Anomalies Detected** | Check `anomaliesJson` field for flagged issues |
| **Status Transitions** | Verify `status`, `reviewedAt`, `approvedAt` columns |
| **API Logs** | Check backend terminal for errors |

---

## 📁 API Test File

Use the provided `httpyac/timesheet.http` file to test all endpoints:
- `POST /timesheets/generate`
- `GET /timesheets`
- `GET /timesheets/:id`
- `POST /timesheets/:id/populate`
- `PATCH /timesheets/:id/status`

---

Happy Testing! 📊
