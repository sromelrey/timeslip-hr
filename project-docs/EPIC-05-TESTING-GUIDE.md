# Epic 5: Payroll & Payslips - Testing Guide

Use this guide to verify the **Payroll and Payslip Management** feature.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1.  **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2.  **Frontend**: `cd frontend && npm run dev`
3.  **Admin URL**: Open [http://localhost:3001/admin/payroll](http://localhost:3001/admin/payroll)

---

## 👤 Test Account Info

You need:
- **Admin Account**: Log in with admin credentials (e.g., `admin@example.com` / `Admin123!`)
- **Existing Timesheets**: Ensure approved timesheets exist from Epic 4
- **Employee Compensation**: Verify employees have compensation records (hourly/daily/salaried rates)

> [!TIP]
> If employees are missing compensation records, add them via the employee management page or seed data.

---

## 🧪 Test Scenarios

### 1. Pay Period Management

#### Create Pay Period
- **Action**: Navigate to **Payroll** page → **Pay Periods** tab → Click **Create Pay Period**
- **Input**: 
  - Start Date: `2026-01-01`
  - End Date: `2026-01-15`
- **Expected**: 
  - Pay period appears in table with `OPEN` status
  - Period displays as "Jan 1 - Jan 15, 2026"

#### Close Pay Period
- **Action**: Click **Close** button on an OPEN pay period
- **Expected**: 
  - Status changes to `CLOSED`
  - "Closed At" timestamp is populated
  - Button changes to **Reopen**

#### Reopen Pay Period
- **Action**: Click **Reopen** button on a CLOSED pay period
- **Expected**: 
  - Status changes back to `OPEN`
  - "Closed At" timestamp is cleared
  - Button changes back to **Close**

#### Overlap Validation
- **Action**: Try creating a pay period that overlaps with an existing one
- **Expected**: 
  - Backend returns error
  - Error message displays: "Pay period overlaps with existing period..."

---

### 2. Payslip Generation

> **Important**: Requires APPROVED timesheets for the pay period

#### Generate Payslips
- **Action**: Navigate to **Payslips** tab → Click **Generate Payslips**
- **Input**: Select a pay period from dropdown
- **Expected**: 
  - New payslip records appear in table (one per employee with timesheet)
  - Status is `DRAFT`
  - Gross Pay calculated correctly:
    - **Hourly**: `(total minutes ÷ 60) × hourly rate`
    - **Daily**: `days worked × daily rate`
    - **Salaried**: `monthly salary ÷ 2`

#### View Payslip Details
- **Action**: Review generated payslips in table
- **Expected**: 
  - Employee name displayed
  - Pay period dates shown
  - Total hours formatted as "Xh Ym" (e.g., "40h 30m")
  - Gross Pay in PHP currency (e.g., "₱12,000.00")
  - Net Pay equals Gross Pay (no deductions yet)

---

### 3. Payslip Workflow

#### Finalize Payslip
- **Action**: Click **Finalize** button on a DRAFT payslip
- **Expected**: 
  - Status changes to `FINALIZED`
  - Badge color changes from secondary to default
  - Button changes to **Void** only

#### Void Payslip (from DRAFT)
- **Action**: Click **Void** button on a DRAFT payslip
- **Confirm**: Accept confirmation dialog
- **Expected**: 
  - Status changes to `VOID`
  - Badge color changes to red/destructive
  - No action buttons available

#### Void Payslip (from FINALIZED)
- **Action**: Click **Void** button on a FINALIZED payslip
- **Confirm**: Accept confirmation dialog
- **Expected**: 
  - Status changes to `VOID`
  - Allows correcting mistakes on finalized payslips

---

### 4. Filtering & Refresh

#### Filter by Pay Period
- **Action**: Use the period filter dropdown in Payslips tab
- **Input**: Select a specific pay period
- **Expected**: 
  - Table shows only payslips for selected period
  - Count matches expected number of employees

#### Refresh Data
- **Action**: Click **Refresh** button in either tab
- **Expected**: 
  - Loading spinner appears briefly
  - Table data refreshes from backend
  - Any backend changes are reflected

---

## 🛠️ Verification & Troubleshooting

| Check | How |
|-------|-----|
| **Pay Period Created** | Query `pay_periods` table for new records |
| **Payslips Generated** | Query `payslips` table for `payPeriodId` |
| **Calculation Correct** | Verify `gross_pay` against timesheet totals |
| **Items Created** | Query `payslip_items` table for earnings entries |
| **Status Transitions** | Check `status`, `finalized_at`, `voided_at` columns |
| **API Logs** | Check backend terminal for errors |

### Common Issues

**Problem**: "No timesheets found" when generating payslips  
**Solution**: Ensure timesheets exist and are APPROVED for the selected pay period

**Problem**: Payslip shows ₱0.00 gross pay  
**Solution**: Verify employee has compensation record with valid rate

**Problem**: Duplicate payslips error  
**Solution**: Payslips already exist for this period. Use specific `employeeIds` or delete existing ones.

---

## 📁 API Test File

Use the provided `httpyac/payroll.http` file to test all endpoints:

```bash
cd backend
npx httpyac send httpyac/payroll.http --all
```

**Key Endpoints**:
- `POST /payroll/pay-periods` - Create pay period
- `GET /payroll/pay-periods` - List pay periods
- `PATCH /payroll/pay-periods/:id/close` - Close period
- `POST /payroll/payslips/generate` - Generate payslips
- `GET /payroll/payslips` - List payslips (with optional filter)
- `PATCH /payroll/payslips/:id/finalize` - Finalize payslip
- `PATCH /payroll/payslips/:id/void` - Void payslip

---

## ✨ Custom Hooks Testing

Epic 5 introduces custom hooks for clean component logic:

### Verify Hook Behavior
1. **usePayPeriodActions**: 
   - Open pay period table
   - Close/Reopen actions should show loading state
   - Action loading indicator appears on correct row

2. **usePayslipActions**:
   - Finalize/Void actions should show confirmation
   - Loading state prevents double-clicks
   - Currency formatting displays correctly

---

## 🎯 Acceptance Criteria

- [ ] Can create pay periods without overlaps
- [ ] Can close and reopen pay periods
- [ ] Can generate payslips for a pay period
- [ ] Payslip calculations match timesheet data
- [ ] Can finalize payslips (DRAFT → FINALIZED)
- [ ] Can void payslips (any status → VOID)
- [ ] Pay period filtering works correctly
- [ ] Currency and time formatting display properly
- [ ] Custom hooks keep UI responsive with loading states

---

Happy Testing! 💰
