# Epic 5: Payroll & Payslips - Testing Guide

Use this guide to verify the **Payroll Management & Payslip Generation** features.

## 🏁 Prerequisites

Before testing, ensure both the backend and frontend are running:

1. **Backend**: `cd backend && npm run start:dev` (Docker should be up)
2. **Frontend**: `cd frontend && npm run dev`
3. **Admin URL**: Open [http://localhost:3001/admin/payroll](http://localhost:3001/admin/payroll)
4. **Dependencies**: Run `npm install` in backend to install `pdfkit` and `archiver` (if implementing bulk export)

---

## 👤 Test Account Info

You need:
- **Admin Account**: Log in with admin credentials (e.g., `admin@example.com` / `Admin123!`)
- **Pay Period**: At least one CLOSED pay period with timesheets
- **Timesheets**: Approved timesheets from Epic 4 testing
- **Employees**: Active employees with compensation records

> [!TIP]
> Run the database seeder to create test data: `npm run seed`

---

## 🧪 Test Scenarios

### Feature 1: PDF Generation

#### 1.1 Generate and Finalize Payslips
- **Action**: Navigate to **Payroll** page, select a pay period, click **Generate Payslips**.
- **Expected**: 
  - New `Payslip` records appear in the table (one per employee with timesheets).
  - Status should be `DRAFT`.
  - `grossPay` calculated from timesheet hours × hourly rate.

#### 1.2 Download Payslip PDF
- **Action**: Click **Finalize** on a draft payslip, then click **Download PDF** button.
- **Expected**: 
  - PDF file downloads with filename `payslip-{id}.pdf`.
  - PDF contains:
    - ✅ Company name header
    - ✅ Employee details (name, employee number)
    - ✅ Pay period dates
    - ✅ Earnings table with "Basic Pay"
    - ✅ Deductions table (if any deductions exist)
    - ✅ Summary: Gross Pay, Total Deductions, Net Pay
    - ✅ Total hours worked
    - ✅ Generation timestamp

#### 1.3 PDF Formatting Validation
- **Check**:
  - Margins are consistent
  - Text doesn't overflow
  - Tables are properly aligned
  - Currency formatting shows `₱` symbol
  - All sections are clearly labeled

---

### Feature 2: Deductions & Allowances

#### 2.1 Create Fixed Deduction
- **Action**: Use API client or Swagger UI:
  ```http
  POST /payroll/deductions
  Content-Type: application/json
  Authorization: Bearer {token}

  {
    "employeeId": 1,
    "type": "SSS",
    "label": "SSS Contribution",
    "calculationType": "FIXED",
    "amount": 500,
    "isActive": true
  }
  ```
- **Expected**: 
  - Deduction created with status 201.
  - `GET /payroll/deductions?employeeId=1` returns the deduction.

#### 2.2 Create Percentage Deduction
- **Action**: Create a percentage-based deduction:
  ```json
  {
    "employeeId": 1,
    "type": "TAX",
    "label": "Withholding Tax (5%)",
    "calculationType": "PERCENTAGE",
    "amount": 5,
    "isActive": true
  }
  ```
- **Expected**: Deduction created successfully.

#### 2.3 Test Date-Ranged Deductions
- **Action**: Create a deduction with effective dates:
  ```json
  {
    "employeeId": 1,
    "type": "LOAN",
    "label": "Salary Loan Deduction",
    "calculationType": "FIXED",
    "amount": 1000,
    "effectiveFrom": "2026-01-01",
    "effectiveUntil": "2026-06-30",
    "isActive": true
  }
  ```
- **Expected**: 
  - Deduction only applies to payslips within the date range.
  - Payslips outside the range should not include this deduction.

#### 2.4 Generate Payslips with Deductions
- **Action**: Generate payslips for the employee with deductions.
- **Expected**: 
  - Payslip includes deduction items in `payslip.items[]`.
  - `totalDeductions` = sum of all deduction amounts.
  - `netPay` = `grossPay` - `totalDeductions`.
  - **Fixed deduction**: exact amount (₱500).
  - **Percentage deduction**: calculated as `grossPay × 5% / 100`.

#### 2.5 Verify PDF Includes Deductions
- **Action**: Download PDF for payslip with deductions.
- **Expected**: 
  - PDF shows "Deductions" section with table.
  - Each deduction listed with label and amount.
  - Summary shows correct `Total Deductions` and `Net Pay`.

#### 2.6 Update and Deactivate Deduction
- **Action**: 
  ```http
  PATCH /payroll/deductions/{id}
  {
    "amount": 600,
    "isActive": false
  }
  ```
- **Expected**: 
  - Deduction amount updated to ₱600.
  - `isActive: false` means it won't apply to new payslips.

#### 2.7 Delete Deduction
- **Action**: `DELETE /payroll/deductions/{id}`
- **Expected**: 
  - Deduction soft-deleted (status 200).
  - `deletedAt` timestamp populated.
  - Deduction no longer appears in `GET /payroll/deductions`.

#### 2.8 Verify "Seeded" Deductions (Feature 5.2 Test)
- **Goal**: Verify optional deductions implementation using seeded companies.
- **Scenario A: Tech Solutions Inc. (With Deductions)**
  - **Employee**: Alice Tech
  - **Expected Seeded Data**:
    - SSS Contribution (₱1125.00)
    - PhilHealth (2.5%)
    - Pag-IBIG (₱200.00)
  - **Action**: Generate payslip for Alice Tech.
  - **Result**: Net Pay should be lower than Gross Pay (Deductions applied).

- **Scenario B: Startup Hub (No Deductions)**
  - **Employee**: Bob Startup
  - **Expected Seeded Data**: No deductions.
  - **Action**: Generate payslip for Bob Startup.
  - **Result**: Net Pay should EQUAL Gross Pay (No deductions checked).


---

### Feature 3: Bulk PDF Export (If Implemented)

#### 3.1 Export All Payslips for Pay Period
- **Action**: Navigate to pay period with multiple finalized payslips, click **Export All PDFs**.
- **Expected**: 
  - ZIP file downloads with filename `payslips-period-{id}.zip`.
  - ZIP contains individual PDFs for each payslip.
  - Filenames follow pattern: `payslip-{employeeNumber}.pdf`.

#### 3.2 Verify ZIP Contents
- **Check**:
  - ✅ Correct number of PDFs (matches payslip count)
  - ✅ Each PDF is valid and opens correctly
  - ✅ No corruption or missing files

---

### Feature 4: Overtime Calculation (If Implemented)

#### 4.1 Configure Company Overtime Settings
- **Action**: Update company record with:
  ```sql
  UPDATE companies 
  SET regular_minutes_per_day = 480, 
      overtime_multiplier = 1.5 
  WHERE id = 1;
  ```
- **Expected**: Settings saved.

#### 4.2 Create Timesheet with Overtime
- **Action**: 
  - Create timesheet day with >8 hours (e.g., 540 minutes = 9 hours).
  - Generate payslip for this employee.
- **Expected**: 
  - Payslip shows `totalOvertimeMinutes = 60` (1 hour).
  - Separate "Overtime Pay" item in earnings.
  - Overtime pay = `(60 / 60) × hourlyRate × 1.5`.

---

### Feature 5: Employee Portal (If Implemented)

#### 5.1 Employee View Own Payslips
- **Action**: Login as employee user, navigate to `/employee/payslips`.
- **Expected**: 
  - Only own payslips displayed.
  - Cannot see other employees' payslips.

#### 5.2 Employee Download Own PDF
- **Action**: Click **Download PDF** on own payslip.
- **Expected**: 
  - PDF downloads successfully.

#### 5.3 Security: Block Access to Other Payslips
- **Action**: Attempt to access `GET /payroll/employee/payslips/{otherId}`.
- **Expected**: 
  - 403 Forbidden error.
  - Security check prevents accessing other employees' data.

---

## 🛠️ Verification & Troubleshooting

| Check | How |
|-------|-----|
| **Payslips Created** | Query `payslips` table for new records |
| **Deductions Applied** | Check `payslip_items` table for type `DEDUCTION` |
| **PDF Downloaded** | Verify file size > 0, can open in PDF reader |
| **Net Pay Calculation** | `netPay = grossPay - totalDeductions` |
| **Deduction Calculation** | Fixed: exact amount, Percentage: `grossPay × (amount/100)` |
| **Date Range Logic** | Deductions outside `effectiveFrom`/`effectiveUntil` ignored |
| **API Logs** | Check backend terminal for errors |

---

## 📁 API Test Files

### Using httpyac or REST Client

Create `httpyac/payroll.http`:

```http
### Variables
@baseUrl = http://localhost:3000
@token = YOUR_JWT_TOKEN

### ============== Pay Periods ==============

### Get Pay Periods
GET {{baseUrl}}/payroll/pay-periods
Authorization: Bearer {{token}}

### Create Pay Period
POST {{baseUrl}}/payroll/pay-periods
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "startDate": "2026-01-01",
  "endDate": "2026-01-15"
}

### ============== Payslips ==============

### Generate Payslips
POST {{baseUrl}}/payroll/payslips/generate
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "payPeriodId": 1
}

### Get All Payslips
GET {{baseUrl}}/payroll/payslips
Authorization: Bearer {{token}}

### Get Payslip Details
GET {{baseUrl}}/payroll/payslips/1
Authorization: Bearer {{token}}

### Finalize Payslip
PATCH {{baseUrl}}/payroll/payslips/1/finalize
Authorization: Bearer {{token}}

### Download Payslip PDF
GET {{baseUrl}}/payroll/payslips/1/pdf
Authorization: Bearer {{token}}

### ============== Deductions ==============

### Create Fixed Deduction
POST {{baseUrl}}/payroll/deductions
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "employeeId": 1,
  "type": "SSS",
  "label": "SSS Contribution",
  "calculationType": "FIXED",
  "amount": 500
}

### Create Percentage Deduction
POST {{baseUrl}}/payroll/deductions
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "employeeId": 1,
  "type": "TAX",
  "label": "Withholding Tax (5%)",
  "calculationType": "PERCENTAGE",
  "amount": 5
}

### Get Employee Deductions
GET {{baseUrl}}/payroll/deductions?employeeId=1
Authorization: Bearer {{token}}

### Update Deduction
PATCH {{baseUrl}}/payroll/deductions/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "amount": 600,
  "isActive": false
}

### Delete Deduction
DELETE {{baseUrl}}/payroll/deductions/1
Authorization: Bearer {{token}}

### ============== Bulk Export (if implemented) ==============

### Export Pay Period PDFs
GET {{baseUrl}}/payroll/pay-periods/1/payslips/export
Authorization: Bearer {{token}}
```

---

## 🔍 Database Queries for Manual Verification

```sql
-- Check payslips
SELECT p.id, p.status, p.gross_pay, p.total_deductions, p.net_pay,
       e.first_name, e.last_name, pp.start_date, pp.end_date
FROM payslips p
JOIN employees e ON p.employee_id = e.id
JOIN pay_periods pp ON p.pay_period_id = pp.id
ORDER BY p.created_at DESC;

-- Check payslip items (earnings + deductions)
SELECT pi.*, p.employee_id, p.pay_period_id
FROM payslip_items pi
JOIN payslips p ON pi.payslip_id = p.id
WHERE p.id = 1
ORDER BY pi.type, pi.created_at;

-- Check deductions
SELECT d.*, e.first_name, e.last_name
FROM deductions d
JOIN employees e ON d.employee_id = e.id
WHERE d.deleted_at IS NULL
ORDER BY d.created_at DESC;

-- Verify net pay calculation
SELECT 
  id,
  gross_pay,
  total_deductions,
  net_pay,
  (gross_pay - total_deductions) as calculated_net_pay,
  CASE 
    WHEN net_pay = (gross_pay - total_deductions) THEN '✅ Correct'
    ELSE '❌ Mismatch'
  END as validation
FROM payslips;
```

---

## ✅ Test Checklist

- [ ] Payslips generate successfully for pay period
- [ ] PDF downloads with all required sections
- [ ] PDF formatting is professional and readable
- [ ] Fixed deductions apply exact amount
- [ ] Percentage deductions calculate correctly
- [ ] Date-ranged deductions only apply within effective dates
- [ ] Inactive deductions don't apply to new payslips
- [ ] Net pay = Gross pay - Total deductions
- [ ] Deductions appear in PDF deductions table
- [ ] Bulk export creates ZIP with all PDFs (if implemented)
- [ ] Overtime hours calculated and displayed (if implemented)
- [ ] Employee portal shows only own payslips (if implemented)
- [ ] Security prevents cross-employee access

---

Happy Testing! 💰📊
