# Epic 3: Time Logging - Testing Guide

Welcome back! Use this guide to verify the **Employee Time Logging (Kiosk)** feature we implemented.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1.  **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2.  **Frontend**: `cd frontend && npm run dev`
3.  **Kiosk URL**: Open [http://localhost:3001/kiosk](http://localhost:3001/kiosk) (or your current frontend port)

---

## 👤 Test Account Info

You need an active employee to test. If you don't have one, you can check the database or use the Admin UI if it's already seeded.

- **Default Test Employee**: `2025001` (Assuming seeds were run)
- **PIN**: For testing, if no PIN is set, the system might require one to be configured. 
  > [!TIP]
  > If you encounter "Invalid PIN" or "No PIN set", you can set a PIN for an employee via the database or by using the `setPin` method in `EmployeeService` (requires a small script or temporary controller call).

---

## 🧪 Test Scenarios

Follow these steps to verify the full flow:

### 1. Clock In (Start Shift)
- **Action**: Enter Employee Number `2025001`, enter PIN, and click **Clock In**.
- **Expected**: 
  - Toast notification shows success.
  - "Current Status" card updates to `CLOCK_IN`.
  - "Recent Activity" table shows the new entry.
  - **Clock In** button becomes disabled; **Clock Out** and **Break In** become enabled.

### 2. Break In (Start Break)
- **Action**: Click **Break In**.
- **Expected**: 
  - Status updates to `BREAK_IN`.
  - Only **Break Out** remains enabled.

### 3. Break Out (End Break)
- **Action**: Click **Break Out**.
- **Expected**: 
  - Status updates back to `CLOCK_IN` (or `BREAK_OUT` event recorded).
  - **Clock Out** becomes enabled again.

### 4. Clock Out (End Shift)
- **Action**: Click **Clock Out**.
- **Expected**: 
  - Status updates to `CLOCKED_OUT`.
  - Only **Clock In** is enabled for the next shift.

---

## 🛠️ Verification & Troubleshooting

- **Idempotency**: Try double-clicking a button quickly. Only one log should appear in the "Recent Activity" list.
- **Server Time**: Ensure the clock on the Kiosk matches your server time.
- **API Logs**: Check the backend terminal for logs if a request fails.
- **Data Check**: You can use the `time-events` table in PostgreSQL to verify that records are being persisted correctly with the right `employeeId` and `type`.

---

Happy Testing! 🕒
