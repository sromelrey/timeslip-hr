# Epic 7: System Settings & Configuration - Testing Guide

Use this guide to verification the **System Settings** module, which includes Company Details, Payroll Policies, and Security Settings.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1. **Backend**: `cd backend && npm run start:dev`
2. **Frontend**: `cd frontend && npm run dev`
3. **Admin URL**: Open [http://localhost:3001/admin/settings](http://localhost:3001/admin/settings)

---

## 🧪 Test Scenarios

### Feature 1: General Settings

#### 1.1 View General Settings
- **Action**: Navigate to `/admin/settings` (General tab is default).
- **Expected**:
    - Form loads with fields: Timezone, Currency.
    - Fields are populated with existing data (or defaults provided by backend).

#### 1.2 Update General Settings
- **Action**:
    1. Change Timezone to `Asia/Tokyo`.
    2. Change Currency to `JPY`.
    3. Click "Save Changes".
- **Expected**:
    - "Settings Saved" toast appears.
    - Page does not reload.
    - Refresh the page -> Values persist (`Asia/Tokyo`, `JPY`).

---

### Feature 2: Payroll Policies

#### 2.1 Configure Pay Period
- **Action**:
    1. Click "Payroll Policies" tab.
    2. Change "Pay Period Cycle" to `SEMI_MONTHLY`.
    3. Save.
- **Expected**:
    - Success toast.
    - Refresh page -> `SEMI_MONTHLY` is selected.

#### 2.2 Configure Rates and Rules
- **Action**:
    1. Set "Default Hourly Rate" to `150.50`.
    2. Set "Break Policy" to `PAID`.
    3. Set "Grace Period" to `15` minutes.
    4. Save.
- **Expected**:
    - Success toast.
    - Database verification (optional): `SELECT default_hourly_rate FROM settings;` should return `150.50`.

---

### Feature 3: Security & Compliance

#### 3.1 Configure Session Settings
- **Action**:
    1. Click "Security & Compliance" tab.
    2. Set "Session Duration" to `60` minutes.
    3. Set "Data Retention" to `24` months.
    4. Save.
- **Expected**:
    - Success toast.
    - Refresh -> Values persist.

#### 3.2 Update Policy Descriptions
- **Action**:
    1. Enter text in "Password Policy Description".
    2. Enter text in "PIN Policy Description".
    3. Save.
- **Expected**:
    - Success toast.
    - Text areas retain content after refresh.

---

## 🛡️ DTO Validation Testing (Backend)

#### 4.1 Invalid Updates
- **Action**:
    1. Use Postman/REST Client to `PATCH /settings`.
    2. Body: `{ "gracePeriodMinutes": -5 }` (Negative number).
- **Expected**:
    - Response: `400 Bad Request`.
    - Message: `gracePeriodMinutes must not be less than 0`.

#### 4.2 Type Mismatch
- **Action**:
    1. `PATCH /settings` with body `{ "defaultHourlyRate": "im-a-string" }`.
- **Expected**:
    - Response: `400 Bad Request`.
    - Message indicates type validation failure.

---

## 📊 Verification Checklist

| Check | How to Verify |
|-------|---------------|
| **Tabs Navigation** | Switching between General, Payroll, Security works without lag |
| **Data Persistence** | Changes saved in one tab persist after refresh |
| **Toast Notifications** | Success message appears on save, Error on failure |
| **Validation** | Negative numbers or invalid formats are rejected |
| **Loading State** | Buttons show "Saving..." and are disabled during submitting |

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Settings not found" error | Ensure the company exists and `SettingsService` logic creates default settings if missing. |
| Form fields empty | Check Redux DevTools to see if `settings/fetchSettings` fulfilled successfully. |
| Save button spinner forever | Check network tab for pending request or console for errors. |
