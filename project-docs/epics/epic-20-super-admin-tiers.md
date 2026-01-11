# EPIC-20: Super Admin Panel & Tier Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-20 |
| **Epic Name** | Super Admin Panel & Tier Management |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Sprint** | TBD |
| **Story Points** | 26 |

---

## Purpose

Implement a **super admin panel** to manage multi-tenant operations, assign pricing tiers to companies, and enforce tier-based limitations (employee count, admin accounts, kiosk sessions, data retention). This creates the backend infrastructure to support the freemium pricing model.

---

## Business Context

With the introduction of Free/Basic/Pro/Enterprise tiers on the landing page, we need:
1. **Super admin controls** to create and manage company accounts
2. **Tier assignment** to companies (Free, Basic, Pro, Enterprise)
3. **Limitation enforcement** based on assigned tier
4. **Usage monitoring** to track companies approaching tier limits
5. **Upgrade/downgrade workflows** to change company tiers

---

## Stories

### STORY-045: Company CRUD API
| Field | Value |
|-------|-------|
| **Story ID** | STORY-045 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a super admin, I want to create, read, update, and delete company accounts so that I can onboard new customers.

#### Sub-Task: BE-045-1 – Extend Company Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-045-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Add `tier` column to Company entity (enum: FREE, BASIC, PRO, ENTERPRISE)
- Add `tierLimits` JSON column for tier-specific limits:
  ```typescript
  {
    maxEmployees: number | null,  // null = unlimited
    maxAdmins: number | null,
    maxKioskSessions: number | null,
    dataRetentionMonths: number | null  // null = unlimited
  }
  ```
- Add `usage` JSON column for current usage tracking:
  ```typescript
  {
    employeeCount: number,
    adminCount: number,
    activeKioskSessions: number,
    oldestDataDate: string (ISO)
  }
  ```
- Add `billingEmail` column
- Add `trialEndsAt` nullable timestamp
- Add `subscriptionStatus` enum (TRIAL, ACTIVE, SUSPENDED, CANCELLED)

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/entities/company.entity.ts` | [MODIFY] Add tier fields |
| `backend/src/types/enums.ts` | [MODIFY] Add CompanyTier, SubscriptionStatus enums |

---

#### Sub-Task: BE-045-2 – Company Module & Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-045-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create `CompanyModule`, `CompanyService`, `CompanyController`
- Implement CRUD operations:
  - `POST /api/super-admin/companies` - Create company
  - `GET /api/super-admin/companies` - List all companies (with pagination, filters)
  - `GET /api/super-admin/companies/:id` - Get company details
  - `PATCH /api/super-admin/companies/:id` - Update company
  - `DELETE /api/super-admin/companies/:id` - Soft delete company
- Implement DTOs with validation:
  - `CreateCompanyDto` (name, tier, billingEmail)
  - `UpdateCompanyDto` (name, tier, tierLimits, subscriptionStatus)
  - `CompanyFilterDto` (tier, status, search)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/company/company.module.ts` | [NEW] Module definition |
| `backend/src/modules/company/providers/company.service.ts` | [NEW] Business logic |
| `backend/src/modules/company/controllers/company.controller.ts` | [NEW] API endpoints |
| `backend/src/modules/company/dto/` | [NEW] DTOs for create/update/filter |

---

### STORY-046: Tier Limitation Enforcement
| Field | Value |
|-------|-------|
| **Story ID** | STORY-046 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As the system, I need to enforce tier limitations so that companies cannot exceed their plan limits.

#### Sub-Task: BE-046-1 – Tier Limits Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-046-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create `TierLimitsService` to:
  - Get tier limits for a company
  - Check if action exceeds limits
  - Get current usage stats
- Implement default tier limits:
  ```typescript
  const TIER_DEFAULTS = {
    FREE: {
      maxEmployees: 20,
      maxAdmins: 1,
      maxKioskSessions: 1,
      dataRetentionMonths: 6
    },
    BASIC: {
      maxEmployees: null, // unlimited
      maxAdmins: 5,
      maxKioskSessions: 3,
      dataRetentionMonths: null
    },
    PRO: {
      maxEmployees: null,
      maxAdmins: null,
      maxKioskSessions: null,
      dataRetentionMonths: null
    },
    ENTERPRISE: {
      maxEmployees: null,
      maxAdmins: null,
      maxKioskSessions: null,
      dataRetentionMonths: null
    }
  };
  ```

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/company/providers/tier-limits.service.ts` | [NEW] Tier limit logic |
| `backend/src/modules/company/constants/tier-defaults.ts` | [NEW] Default limits |

---

#### Sub-Task: BE-046-2 – Integrate Limits into Employee Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-046-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Modify `EmployeeService.create()` to check `maxEmployees` limit
- Throw `TierLimitExceededException` if limit reached
- Return helpful error message: "Free tier limited to 20 employees. Upgrade to Basic for unlimited employees."

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/modules/employee/providers/employee.service.ts` | [MODIFY] Add tier check |
| `backend/src/common/exceptions/tier-limit-exceeded.exception.ts` | [NEW] Custom exception |

---

#### Sub-Task: BE-046-3 – Integrate Limits into Auth/User Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-046-3 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Modify user creation to check `maxAdmins` for ADMIN role
- Prevent creating more admins than allowed by tier

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/modules/auth/providers/auth.service.ts` | [MODIFY] Check admin limit |

---

#### Sub-Task: BE-046-4 – Integrate Limits into Time Event Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-046-4 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Modify `TimeEventService.create()` to check concurrent kiosk sessions
- Count active sessions (employees currently clocked in)
- Block clock-in if `maxKioskSessions` reached
- Error message: "Free tier limited to 1 concurrent kiosk session. Please wait for another employee to clock out or upgrade to Basic."

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/modules/time-event/providers/time-event.service.ts` | [MODIFY] Check kiosk session limit |

---

### STORY-047: Super Admin Frontend Panel
| Field | Value |
|-------|-------|
| **Story ID** | STORY-047 |
| **Status** | 📋 Planned |
| **Assignee** | Frontend |
| **Story Points** | 5 |

**Description:**  
As a super admin, I want a dedicated admin panel so that I can manage all companies in the system.

#### Sub-Task: FE-047-1 – Super Admin Layout
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-047-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create new route group `app/(super-admin)/`
- Add super admin sidebar with navigation:
  - Dashboard
  - Companies
  - Analytics
  - Settings
- Implement `SUPER_ADMIN` role check in middleware

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(super-admin)/layout.tsx` | [NEW] Super admin layout |
| `frontend/components/super-admin/sidebar.tsx` | [NEW] Navigation |
| `frontend/middleware.ts` | [MODIFY] Add super admin routes |

---

#### Sub-Task: FE-047-2 – Companies List Page
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-047-2 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create companies data table with columns:
  - Name
  - Tier (badge with color coding)
  - Subscription Status
  - Employee Count / Max
  - Created Date
  - Actions (Edit, View, Delete)
- Add filters: Tier, Status
- Add search by company name
- Add "Create Company" button

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(super-admin)/companies/page.tsx` | [NEW] Companies list |
| `frontend/components/super-admin/companies/companies-table.tsx` | [NEW] Data table |

---

#### Sub-Task: FE-047-3 – Create/Edit Company Dialog
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-047-3 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create company form dialog with fields:
  - Company Name
  - Tier (dropdown: Free, Basic, Pro, Enterprise)
  - Billing Email
  - Subscription Status
  - Custom Tier Limits (optional override)
- Display default limits for selected tier
- Allow super admin to customize limits

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/components/super-admin/companies/company-dialog.tsx` | [NEW] Form dialog |
| `frontend/store/slices/company-slice.ts` | [NEW] Redux slice |
| `frontend/store/thunks/company-thunks.ts` | [NEW] API thunks |

---

### STORY-048: Usage Monitoring Dashboard
| Field | Value |
|-------|-------|
| **Story ID** | STORY-048 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As a super admin, I want to monitor company usage so that I can identify companies approaching tier limits.

#### Sub-Task: BE-048-1 – Usage Stats API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-048-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create endpoint `GET /api/super-admin/companies/:id/usage`
- Return current usage vs. limits:
  ```json
  {
    "employees": { "current": 18, "max": 20, "percentage": 90 },
    "admins": { "current": 1, "max": 1, "percentage": 100 },
    "kioskSessions": { "current": 0, "max": 1 },
    "dataRetention": { "oldestDataDate": "2025-07-11", "expiresAt": "2026-01-11" }
  }
  ```

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/modules/company/controllers/company.controller.ts` | [MODIFY] Add usage endpoint |

---

#### Sub-Task: FE-048-1 – Company Usage Widget
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-048-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create usage widget showing:
  - Progress bars for each limit (employees, admins, kiosks)
  - Color coding: Green (<70%), Yellow (70-90%), Red (>90%)
  - "Upgrade" button for companies approaching limits

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/components/super-admin/companies/usage-widget.tsx` | [NEW] Usage display |

---

### STORY-049: Tier Feature Access Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-049 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As the system, I need to enforce module/feature access based on tier so that companies can only use features available in their plan, with support for add-on purchases and trial access.

#### Sub-Task: BE-049-1 – Feature Access Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-049-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create `FeatureAccessService` with logic to check company feature access
- Implement feature resolution logic (company_features override → tier_features default)
- Create `TierFeaturesEntity`, `CompanyFeaturesEntity`
- Implement `checkFeatureAccess(companyId, featureCode): boolean`
- Implement `getCompanyFeatures(companyId): Feature[]`
- Support time-based overrides (effectiveFrom/effectiveTo)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/feature.entity.ts` | [NEW] Features master table |
| `backend/src/entities/tier-feature.entity.ts` | [NEW] Tier defaults |
| `backend/src/entities/company-feature.entity.ts` | [NEW] Company overrides |
| `backend/src/modules/features/providers/feature-access.service.ts` | [NEW] Feature access logic |

**Feature Access Logic:**
```typescript
async checkFeatureAccess(companyId: number, featureCode: string): Promise<boolean> {
  // 1. Check company_features override (active within date range)
  const override = await this.companyFeaturesRepo.findOne({
    where: {
      companyId,
      feature: { code: featureCode },
      effectiveFrom: LessThanOrEqual(new Date()),
      effectiveTo: Or(IsNull(), MoreThanOrEqual(new Date()))
    }
  });
  
  if (override) return override.isEnabled;
  
  // 2. Fall back to tier_features default
  const company = await this.companiesRepo.findOne({ where: { id: companyId } });
  const tierDefault = await this.tierFeaturesRepo.findOne({
    where: { tier: company.tier, feature: { code: featureCode } }
  });
  
  return tierDefault?.isEnabled || false;
}
```

---

#### Sub-Task: BE-049-2 – Feature Access Guard/Decorator
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-049-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create `@RequireFeature('LEAVE_MANAGEMENT')` decorator
- Create `FeatureAccessGuard` that checks company's feature access
- Apply to protected routes (e.g., leave management endpoints)
- Throw `FeatureNotAvailableException` with upgrade prompt

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/guards/feature-access.guard.ts` | [NEW] Feature guard |
| `backend/src/common/decorators/require-feature.decorator.ts` | [NEW] Decorator |
| `backend/src/common/exceptions/feature-not-available.exception.ts` | [NEW] Exception |

**Example Usage:**
```typescript
@Controller('leave-requests')
@UseGuards(JwtAuthGuard, FeatureAccessGuard)
export class LeaveRequestController {
  @Post()
  @RequireFeature('LEAVE_MANAGEMENT')
  async create(@Body() dto: CreateLeaveRequestDto) {
    // Only accessible if company tier includes LEAVE_MANAGEMENT
  }
}
```

---

#### Sub-Task: BE-049-3 – Company Features Management API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-049-3 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create API for super admin to manage company_features
- `POST /api/super-admin/companies/:id/features` - Add feature override
- `DELETE /api/super-admin/companies/:id/features/:featureId` - Remove override
- Support add-ons, trials, and admin overrides
- Track who created the override (created_by_user_id)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/features/controllers/company-features.controller.ts` | [NEW] Company features API |
| `backend/src/modules/features/dto/create-company-feature.dto.ts` | [NEW] DTOs |

**Example: Grant trial access**
```typescript
POST /api/super-admin/companies/123/features
{
  "featureCode": "ADVANCED_REPORTS",
  "isEnabled": true,
  "source": "TRIAL",
  "effectiveFrom": "2026-01-11T00:00:00Z",
  "effectiveTo": "2026-02-10T23:59:59Z"
}
```

---

#### Sub-Task: FE-049-1 – Feature Access Hook
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-049-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create `useFeatureAccess()` hook to check enabled features
- Fetch company features on app initialization
- Store in Redux state
- Use hook to conditionally show/hide UI elements
- Show upgrade prompts for disabled features

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/hooks/use-feature-access.ts` | [NEW] Feature access hook |
| `frontend/store/slices/features-slice.ts` | [NEW] Redux slice for features |
| `frontend/components/upgrade-banner.tsx` | [NEW] Upgrade prompt component |

**Example Usage:**
```typescript
const { hasFeature, loading } = useFeatureAccess();

{hasFeature('LEAVE_MANAGEMENT') && (
  <Link href="/leave-requests">Leave Management</Link>
)}

{!hasFeature('ADVANCED_REPORTS') && (
  <UpgradeBanner 
    feature="Advanced Reports" 
    tier="PRO" 
    message="Unlock advanced analytics and custom reports"
  />
)}
```


---

## Tier Management Workflows

### Workflow 1: New Company Signup (Free Tier)
1. Company signs up via landing page "Get Started Free"
2. Backend creates company with `tier: FREE`
3. Auto-populate `tierLimits` from FREE defaults
4. Create first admin user
5. Redirect to onboarding

### Workflow 2: Tier Upgrade
1. Super admin changes company tier (FREE → BASIC)
2. Backend updates `tierLimits` to BASIC defaults
3. Existing employees/data remain intact
4. New limits apply immediately
5. Send notification email to company admin

### Workflow 3: Limit Exceeded
1. Company tries to add 21st employee on FREE tier
2. Backend throws `TierLimitExceededException`
3. Frontend shows error: "You've reached the 20 employee limit. Upgrade to Basic for unlimited employees."
4. Display pricing comparison modal with upgrade CTA

---

## Database Migration

### Migration: Add Tier Fields + Feature Access Tables

```typescript
// migration-add-tier-and-features.ts
export class AddTierAndFeatures1736640000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Create ENUMs
    await queryRunner.query(`
      CREATE TYPE "company_tier_enum" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');
      CREATE TYPE "subscription_status_enum" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED');
      CREATE TYPE "feature_source_enum" AS ENUM ('TIER_OVERRIDE', 'ADDON', 'TRIAL', 'ADMIN_OVERRIDE');
    `);
    
    // Step 2: Add tier fields to companies table
    await queryRunner.query(`
      ALTER TABLE "companies"
        ADD COLUMN "tier" company_tier_enum NOT NULL DEFAULT 'FREE',
        ADD COLUMN "tier_limits" jsonb NOT NULL DEFAULT '{"maxEmployees":20,"maxAdmins":1,"maxKioskSessions":1,"dataRetentionMonths":6}',
        ADD COLUMN "usage" jsonb DEFAULT '{}',
        ADD COLUMN "billing_email" varchar(255),
        ADD COLUMN "trial_ends_at" timestamp,
        ADD COLUMN "subscription_status" subscription_status_enum NOT NULL DEFAULT 'ACTIVE';
    `);
    
    // Step 3: Create features master table
    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" SERIAL PRIMARY KEY,
        "code" varchar(100) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "module_category" varchar(50) NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);
    
    // Step 4: Create tier_features junction table (tier defaults)
    await queryRunner.query(`
      CREATE TABLE "tier_features" (
        "id" SERIAL PRIMARY KEY,
        "tier" company_tier_enum NOT NULL,
        "feature_id" int NOT NULL,
        "is_enabled" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp,
        UNIQUE("tier", "feature_id"),
        FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE
      );
    `);
    
    // Step 5: Create company_features table (company-specific overrides)
    await queryRunner.query(`
      CREATE TABLE "company_features" (
        "id" SERIAL PRIMARY KEY,
        "company_id" int NOT NULL,
        "feature_id" int NOT NULL,
        "is_enabled" boolean NOT NULL,
        "source" feature_source_enum NOT NULL,
        "effective_from" timestamp,
        "effective_to" timestamp,
        "created_by_user_id" int,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp,
        UNIQUE("company_id", "feature_id"),
        FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
        FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE,
        FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL
      );
    `);
    
    // Step 6: Seed features
    await queryRunner.query(`
      INSERT INTO "features" ("code", "name", "module_category", "description") VALUES
      -- CORE features (included in FREE tier)
      ('TIME_ATTENDANCE', 'Time & Attendance', 'CORE', 'Employee time tracking with clock in/out and break management'),
      ('TIMESHEETS', 'Timesheet Management', 'CORE', 'Automated timesheet generation and approval workflows'),
      ('APPROVALS', 'Approval Workflows', 'CORE', 'Multi-level approval for timesheets and leave requests'),
      ('PAYROLL', 'Payroll Processing', 'CORE', 'Automated payroll calculation with PH tax compliance'),
      ('PAYSLIPS', 'Payslip Generation', 'CORE', 'Digital payslips with PDF export'),
      ('EMPLOYEE_PORTAL', 'Employee Portal', 'CORE', 'Self-service portal for employees'),
      ('BASIC_REPORTS', 'Basic Reports', 'CORE', 'Standard attendance and payroll reports'),
      
      -- PREMIUM features (PRO tier and above)
      ('LEAVE_MANAGEMENT', 'Leave Management', 'PREMIUM', 'Comprehensive leave tracking and management'),
      ('ADVANCED_REPORTS', 'Advanced Reports', 'PREMIUM', 'Custom analytics and advanced reporting'),
      ('RECRUITMENT', 'Recruitment', 'PREMIUM', 'Applicant tracking and recruitment workflows'),
      ('PERFORMANCE', 'Performance Management', 'PREMIUM', 'Goal setting and performance reviews'),
      ('LEARNING', 'Learning & Development', 'PREMIUM', 'Training and certification tracking'),
      ('BENEFITS', 'Benefits Management', 'PREMIUM', 'Employee benefits administration'),
      
      -- ENTERPRISE features
      ('SSO', 'Single Sign-On', 'ENTERPRISE', 'Enterprise SSO integration'),
      ('CUSTOM_REPORTS', 'Custom Report Builder', 'ENTERPRISE', 'Build custom reports with drag-and-drop'),
      ('SELF_HOSTING', 'Self-Hosting Option', 'ENTERPRISE', 'Deploy on your own infrastructure'),
      ('API_ACCESS', 'API Access', 'ENTERPRISE', 'Full API access for integrations'),
      ('AUDIT_LOGS', 'Advanced Audit Logs', 'ENTERPRISE', 'Comprehensive audit trail and compliance logging');
    `);
    
    // Step 7: Seed tier_features (defaults for each tier)
    await queryRunner.query(`
      INSERT INTO "tier_features" ("tier", "feature_id", "is_enabled")
      SELECT 'FREE', id, true FROM features WHERE code IN 
        ('TIME_ATTENDANCE', 'TIMESHEETS', 'APPROVALS', 'PAYROLL', 'PAYSLIPS', 'EMPLOYEE_PORTAL', 'BASIC_REPORTS')
      UNION ALL
      SELECT 'FREE', id, false FROM features WHERE code IN 
        ('LEAVE_MANAGEMENT', 'ADVANCED_REPORTS', 'RECRUITMENT', 'PERFORMANCE', 'LEARNING', 'BENEFITS', 'SSO', 'CUSTOM_REPORTS', 'SELF_HOSTING', 'API_ACCESS', 'AUDIT_LOGS')
      
      UNION ALL
      
      SELECT 'BASIC', id, true FROM features WHERE code IN 
        ('TIME_ATTENDANCE', 'TIMESHEETS', 'APPROVALS', 'PAYROLL', 'PAYSLIPS', 'EMPLOYEE_PORTAL', 'BASIC_REPORTS')
      UNION ALL
      SELECT 'BASIC', id, false FROM features WHERE code IN 
        ('LEAVE_MANAGEMENT', 'ADVANCED_REPORTS', 'RECRUITMENT', 'PERFORMANCE', 'LEARNING', 'BENEFITS', 'SSO', 'CUSTOM_REPORTS', 'SELF_HOSTING', 'API_ACCESS', 'AUDIT_LOGS')
      
      UNION ALL
      
      SELECT 'PRO', id, true FROM features WHERE code IN 
        ('TIME_ATTENDANCE', 'TIMESHEETS', 'APPROVALS', 'PAYROLL', 'PAYSLIPS', 'EMPLOYEE_PORTAL', 'BASIC_REPORTS', 'LEAVE_MANAGEMENT', 'ADVANCED_REPORTS', 'RECRUITMENT', 'PERFORMANCE', 'LEARNING', 'BENEFITS')
      UNION ALL
      SELECT 'PRO', id, false FROM features WHERE code IN 
        ('SSO', 'CUSTOM_REPORTS', 'SELF_HOSTING', 'API_ACCESS', 'AUDIT_LOGS')
      
      UNION ALL
      
      SELECT 'ENTERPRISE', id, true FROM features;
    `);
  }
}
```

### Feature Access Resolution Logic

When checking if a company has access to a feature:

```typescript
// Pseudocode for feature access check
function companyHasFeature(companyId: number, featureCode: string): boolean {
  // 1. Check for active company_features override
  const override = companyFeatures.find({
    companyId,
    featureCode,
    effectiveFrom <= now,
    effectiveTo >= now (or null)
  });
  
  if (override) {
    return override.isEnabled;
  }
  
  // 2. Fall back to tier_features default
  const company = companies.findById(companyId);
  const tierDefault = tierFeatures.find({
    tier: company.tier,
    featureCode
  });
  
  return tierDefault?.isEnabled || false;
}
```

### Company Features Use Cases

1. **Add-on Purchase**: Company on BASIC tier purchases LEAVE_MANAGEMENT add-on
   ```sql
   INSERT INTO company_features (company_id, feature_id, is_enabled, source)
   VALUES (123, (SELECT id FROM features WHERE code = 'LEAVE_MANAGEMENT'), true, 'ADDON');
   ```

2. **Trial Unlock**: Give FREE tier company trial access to ADVANCED_REPORTS
   ```sql
   INSERT INTO company_features (company_id, feature_id, is_enabled, source, effective_from, effective_to)
   VALUES (456, (SELECT id FROM features WHERE code = 'ADVANCED_REPORTS'), true, 'TRIAL', NOW(), NOW() + INTERVAL '30 days');
   ```

3. **Admin Override**: Super admin grants special access
   ```sql
   INSERT INTO company_features (company_id, feature_id, is_enabled, source, created_by_user_id)
   VALUES (789, (SELECT id FROM features WHERE code = 'SSO'), true, 'ADMIN_OVERRIDE', 1);
   ```



---

## Success Criteria

✅ Super admin can create companies and assign tiers  
✅ Default tier limits auto-populate based on selected tier  
✅ Employee creation blocked when FREE tier limit (20) reached  
✅ Admin creation blocked when tier limit reached  
✅ Kiosk clock-in blocked when concurrent session limit reached  
✅ Usage stats visible in super admin panel  
✅ Tier changes reflect immediately in enforcement  
✅ Helpful error messages guide users to upgrade  

---

## Future Enhancements (Not in this Epic)

- **Automated Data Archival:** Scheduled job to archive/delete data older than `dataRetentionMonths` for FREE tier
- **Usage Alerts:** Email notifications when companies reach 80% of limits
- **Self-Service Upgrade:** Allow company admins to upgrade tier from their settings panel
- **Billing Integration:** Stripe/PayMongo integration for paid tiers
- **Trial Management:** Auto-downgrade to FREE after trial expires

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Blocks** | None (can be developed independently) |
| **Blocked By** | EPIC-01 (Company entity must exist) |

---

## Technical Notes

- **Role Hierarchy:** SUPER_ADMIN > ADMIN > EMPLOYEE
- **SUPER_ADMIN role** is NOT company-scoped (can access all companies)
- **Tier limits** are enforced at service layer, not database constraints
- **Free tier** becomes paid tier in future with billing integration
- **Usage tracking** updated in real-time via service hooks
