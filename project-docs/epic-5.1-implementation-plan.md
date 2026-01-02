# Epic 5.1: Payroll Enhancement Features - Implementation Plan

This document outlines the implementation plan for completing the remaining Epic 5 features: PDF generation, deductions/allowances, bulk export, overtime calculation, and employee portal.

---

## Overview

**Goal**: Enhance the payroll system with advanced features for production readiness and comprehensive payroll processing.

**Priority Order**:
1. 🔴 **High**: PDF Generation, Deductions/Allowances, Bulk Export
2. 🟡 **Medium**: Overtime Calculation
3. 🟢 **Low**: Employee Portal (self-service)

**Estimated Effort**: 19-25 hours total

---

## Feature 1: PDF Generation (Priority: 🔴 High)

**Effort**: ~4 hours

### Backend Changes

#### 1.1 Install Dependencies
```bash
npm install pdfkit
npm install @types/pdfkit --save-dev
```

#### 1.2 Create PDF Service

**File**: `backend/src/modules/payroll/payslip-pdf.service.ts`

**Responsibilities**:
- Generate PDF buffer from `Payslip` entity
- Create professional payslip template with:
  - Company header (name, address)
  - Employee details (name, ID, position)
  - Pay period dates
  - Earnings breakdown table
  - Deductions breakdown table
  - Gross pay, total deductions, net pay
  - Company footer

**Dependencies**: `PayslipService`, `EmployeeService`, `CompanyService`

#### 1.3 Update Controller

**File**: `backend/src/modules/payroll/payroll.controller.ts`

```typescript
@Get('payslips/:id/pdf')
async downloadPayslipPdf(
  @Param('id', ParseIntPipe) id: number,
  @Res() res: Response
) {
  const pdfBuffer = await this.payslipPdfService.generatePdf(id);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="payslip-${id}.pdf"`,
    'Content-Length': pdfBuffer.length,
  });
  res.end(pdfBuffer);
}
```

### Frontend Changes

#### 1.4 Update Payslip Table

**File**: `frontend/components/payroll/payslip-table.tsx`

- Add "Download PDF" button for FINALIZED payslips
- Use `downloadPayslipPdf()` API call
- Show loading state during download

#### 1.5 Update API Client

**File**: `frontend/lib/payroll.api.ts`

- Already has `downloadPayslipPdf()` function
- Ensure proper blob handling and file download

### Testing
- Verify PDF contains correct data
- Test PDF formatting (margins, fonts, tables)
- Validate download works in all browsers

---

## Feature 2: Deductions & Allowances (Priority: 🔴 High)

**Effort**: ~6 hours

### Backend Changes

#### 2.1 Create Deduction Entity

**File**: `backend/src/entities/deduction.entity.ts`

```typescript
enum DeductionType {
  TAX = 'TAX',
  SSS = 'SSS',
  PHILHEALTH = 'PHILHEALTH',
  PAGIBIG = 'PAGIBIG',
  LOAN = 'LOAN',
  OTHER = 'OTHER',
}

enum DeductionCalculationType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

@Entity('deductions')
export class Deduction extends CommonEntity {
  @Column()
  employeeId: number;
  
  @Column({ type: 'enum', enum: DeductionType })
  type: DeductionType;
  
  @Column()
  label: string;
  
  @Column({ type: 'enum', enum: DeductionCalculationType })
  calculationType: DeductionCalculationType;
  
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Fixed amount or percentage value
  
  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;
  
  @Column({ type: 'date', nullable: true })
  effectiveUntil: Date;
  
  @Column({ default: true })
  isActive: boolean;
}
```

#### 2.2 Create Deduction Service

**File**: `backend/src/modules/payroll/deduction.service.ts`

**Methods**:
- `createDeduction(employeeId, dto)`
- `getEmployeeDeductions(employeeId)`
- `calculateDeductions(employeeId, grossPay)` - returns array of deduction items
- `updateDeduction(id, dto)`
- `deleteDeduction(id)`

#### 2.3 Update Payslip Service

**File**: `backend/src/modules/payroll/payslip.service.ts`

In `generate()` method:
```typescript
// After creating earnings item
const deductions = await this.deductionService.calculateDeductions(
  calc.employeeId,
  calc.grossPay
);

for (const deduction of deductions) {
  const deductionItem = this.payslipItemRepo.create({
    payslipId: savedPayslip.id,
    type: PayslipItemType.DEDUCTION,
    code: deduction.code,
    label: deduction.label,
    amount: deduction.amount,
  });
  await this.payslipItemRepo.save(deductionItem);
}

// Update payslip totals
payslip.totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
payslip.netPay = payslip.grossPay - payslip.totalDeductions;
```

#### 2.4 Create Deduction Controller

**File**: `backend/src/modules/payroll/deduction.controller.ts`

**Endpoints**:
- `GET /payroll/deductions?employeeId=:id` - List deductions
- `POST /payroll/deductions` - Create deduction
- `PATCH /payroll/deductions/:id` - Update deduction
- `DELETE /payroll/deductions/:id` - Delete deduction

### Frontend Changes

#### 2.5 Create Deduction Management UI

**Files**:
- `frontend/components/employee/deduction-list.tsx` - Table of employee deductions
- `frontend/components/employee/deduction-dialog.tsx` - Create/edit dialog
- `frontend/hooks/use-deduction-actions.ts` - Custom hook for logic

**Location**: Add tab to employee detail page or separate section in payroll

#### 2.6 Update Redux State

**Files**:
- `frontend/store/core/deduction-slice.ts`
- `frontend/store/core/thunks/deduction-thunks.ts`
- `frontend/lib/deduction.api.ts`

### Testing
- Create fixed deduction (e.g., ₱500 SSS)
- Create percentage deduction (e.g., 5% tax)
- Verify deductions appear in generated payslips
- Test net pay calculation accuracy

---

## Feature 3: Bulk PDF Export (Priority: 🔴 High)

**Effort**: ~2 hours

### Backend Changes

#### 3.1 Install Archiver

```bash
npm install archiver
npm install @types/archiver --save-dev
```

#### 3.2 Add Bulk Export Method

**File**: `backend/src/modules/payroll/payslip-pdf.service.ts`

```typescript
async exportPayPeriodPdfs(payPeriodId: number): Promise<Buffer> {
  const payslips = await this.payslipService.findAll({ payPeriodId });
  const archive = archiver('zip');
  
  for (const payslip of payslips) {
    const pdfBuffer = await this.generatePdf(payslip.id);
    const filename = `payslip-${payslip.employee.employeeNumber}.pdf`;
    archive.append(pdfBuffer, { name: filename });
  }
  
  await archive.finalize();
  return archive;
}
```

#### 3.3 Add Controller Endpoint

**File**: `backend/src/modules/payroll/payroll.controller.ts`

```typescript
@Get('pay-periods/:id/payslips/export')
async exportPayslipsBulk(
  @Param('id', ParseIntPipe) payPeriodId: number,
  @Res() res: Response
) {
  const zipBuffer = await this.payslipPdfService.exportPayPeriodPdfs(payPeriodId);
  res.set({
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="payslips-period-${payPeriodId}.zip"`,
  });
  res.end(zipBuffer);
}
```

### Frontend Changes

#### 3.4 Add Export Button

**File**: `frontend/components/payroll/payslip-tab.tsx`

- Add "Export All PDFs" button
- Trigger download of ZIP file
- Show progress indicator

### Testing
- Export all payslips for a pay period
- Verify ZIP contains correct number of PDFs
- Validate individual PDFs in ZIP are correct

---

## Feature 4: Overtime Calculation (Priority: 🟡 Medium)

**Effort**: ~3 hours

### Backend Changes

#### 4.1 Add Overtime Configuration

**File**: `backend/src/entities/company.entity.ts`

```typescript
@Column({ type: 'int', default: 480 }) // 8 hours * 60 minutes
regularMinutesPerDay: number;

@Column({ type: 'decimal', precision: 3, scale: 2, default: 1.5 })
overtimeMultiplier: number;
```

#### 4.2 Update Payroll Service

**File**: `backend/src/modules/payroll/payroll.service.ts`

```typescript
const regularThreshold = company.regularMinutesPerDay;
let regularMinutes = 0;
let overtimeMinutes = 0;

for (const day of timesheet.days) {
  if (day.regularMinutes <= regularThreshold) {
    regularMinutes += day.regularMinutes;
  } else {
    regularMinutes += regularThreshold;
    overtimeMinutes += day.regularMinutes - regularThreshold;
  }
}

// Calculate pay
const regularPay = (regularMinutes / 60) * hourlyRate;
const overtimePay = (overtimeMinutes / 60) * hourlyRate * overtimeMultiplier;
grossPay = regularPay + overtimePay;
```

#### 4.3 Update Payslip Entity

**File**: `backend/src/entities/payslip.entity.ts`

```typescript
@Column({ type: 'int', default: 0 })
totalOvertimeMinutes: number;
```

#### 4.4 Create Overtime PayslipItem

In `PayslipService.generate()`:
```typescript
if (calc.totalOvertimeMinutes > 0) {
  const overtimeItem = this.payslipItemRepo.create({
    payslipId: savedPayslip.id,
    type: PayslipItemType.EARNING,
    code: 'OVERTIME',
    label: 'Overtime Pay',
    amount: calc.overtimePay,
  });
  await this.payslipItemRepo.save(overtimeItem);
}
```

### Frontend Changes

#### 4.5 Update Payslip Display

**File**: `frontend/components/payroll/payslip-table.tsx`

- Show overtime hours in separate column
- Display breakdown in payslip details

### Testing
- Set employee to work >8 hours/day
- Generate payslip and verify overtime calculation
- Check overtime multiplier is applied correctly

---

## Feature 5: Employee Portal (Priority: 🟢 Low)

**Effort**: ~4 hours

### Backend Changes

#### 5.1 Add Employee Endpoints

**File**: `backend/src/modules/payroll/payroll.controller.ts`

```typescript
@Get('employee/payslips')
@UseGuards(JwtAuthGuard)
async getEmployeePayslips(@Req() req: AuthenticatedRequest) {
  const employeeId = req.user.employeeId;
  return this.payslipService.findAll({ employeeId });
}

@Get('employee/payslips/:id/pdf')
@UseGuards(JwtAuthGuard)
async downloadEmployeePayslipPdf(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthenticatedRequest,
  @Res() res: Response
) {
  // Verify payslip belongs to employee
  const payslip = await this.payslipService.findOne(id);
  if (payslip.employeeId !== req.user.employeeId) {
    throw new ForbiddenException();
  }
  
  const pdfBuffer = await this.payslipPdfService.generatePdf(id);
  res.end(pdfBuffer);
}
```

### Frontend Changes

#### 5.2 Create Employee Payslip Page

**File**: `frontend/app/(employee)/payslips/page.tsx`

- List employee's payslips
- Filter by year/month
- Download PDF button per payslip

#### 5.3 Create Employee Layout

**File**: `frontend/app/(employee)/layout.tsx`

- Simple navigation for employee views
- Different from admin layout

### Testing
- Login as employee user
- View own payslips
- Download own payslip PDF
- Verify cannot access other employees' payslips

---

## Migration Plan

### Phase 1: Core Enhancements (Week 1)
1. PDF Generation (Day 1-2)
2. Deductions/Allowances (Day 3-5)

### Phase 2: Productivity Features (Week 2)
3. Bulk Export (Day 1)
4. Overtime Calculation (Day 2-3)

### Phase 3: Self-Service (Week 3)
5. Employee Portal (Day 1-2)

---

## Database Migrations

### New Tables
```sql
-- Deductions table
CREATE TABLE deductions (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(id),
  type VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  calculation_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  effective_from DATE,
  effective_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Column Additions
```sql
-- Company table
ALTER TABLE companies 
ADD COLUMN regular_minutes_per_day INT DEFAULT 480,
ADD COLUMN overtime_multiplier DECIMAL(3, 2) DEFAULT 1.50;

-- Payslip table (overtime already exists)
-- No changes needed
```

---

## Testing Checklist

- [ ] PDF generation for all payslip statuses
- [ ] PDF template renders correctly
- [ ] Deductions calculate properly (fixed & percentage)
- [ ] Deduction effective dates work
- [ ] Bulk ZIP export contains all PDFs
- [ ] Overtime detection and calculation
- [ ] Employee can view own payslips only
- [ ] Employee PDF download works
- [ ] All API endpoints have proper auth guards
- [ ] Integration with existing payroll workflow

---

## Rollout Strategy

### Option A: Feature Flags
Deploy all features behind feature flags, enable incrementally:
```typescript
if (featureFlags.pdfGeneration) {
  // Show PDF download button
}
```

### Option B: Incremental Release
Deploy features one at a time:
1. PDF (immediate need)
2. Deductions (payroll accuracy)
3. Bulk Export (admin efficiency)
4. Overtime (if company policy requires)
5. Employee Portal (self-service)

**Recommendation**: Option B for stability and easier testing

---

## Success Metrics

- **PDF Generation**: 100% of finalized payslips can be downloaded
- **Deductions**: Net pay accuracy within ±₱1.00
- **Bulk Export**: Export time <30 seconds for 100 employees
- **Overtime**: 100% accuracy vs manual calculation
- **Employee Portal**: 80% of employees use self-service within 3 months

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| PDF generation performance | Cache generated PDFs for finalized payslips |
| Incorrect deduction calculations | Comprehensive unit tests, manual verification |
| Large ZIP file sizes | Stream ZIP generation, set size limits |
| Employee data leaking | Strict row-level security, audit logs |

---

## Future Enhancements (Post-Epic 5.1)

- Email payslip distribution
- Multi-currency support
- Tax bracket automation (BIR compliance)
- Payslip approval workflow
- Payroll batch processing
- Historical payslip amendments
