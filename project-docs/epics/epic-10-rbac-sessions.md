# EPIC-10: RBAC & Advanced Session Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-10 |
| **Epic Name** | Role-Based Access Control & Advanced Session Management |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Sprint** | Sprint 9-10 |
| **Story Points** | 42 |

---

## Purpose

Implement a comprehensive RBAC system with flexible role/permission management and secure session handling with device tracking and selective revocation.

---

## Stories

### STORY-051: RBAC Entities & Migration
| Field | Value |
|-------|-------|
| **Story ID** | STORY-051 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a developer, I need RBAC database tables so that roles and permissions can be dynamically managed.

#### Sub-Task: BE-051-1 – Create RBAC Entities
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-051-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Role` entity with hierarchy support
- Create `Permission` entity with module + action structure + **featureId** (nullable)
- Create `RolePermission` junction entity
- Create `UserRole` entity with expiration support
- Create `UserPermission` entity for overrides

**Permission Entity Structure:**
```typescript
@Entity('permissions')
export class Permission extends CommonEntity {
  @Column()
  featureId?: number;  // Links permission to a feature (e.g., LEAVE_MANAGEMENT)
  
  @Column()
  module: string;      // e.g., 'leave_requests', 'payroll'
  
  @Column()
  action: string;      // e.g., 'view', 'create', 'approve'
  
  @Column({ unique: true })
  code: string;        // e.g., 'leave_requests.approve'
  
  @ManyToOne(() => Feature, { nullable: true })
  feature?: Feature;
}
```

**Why featureId on Permission?**
- Allows double-gating: Company must have feature enabled AND user must have permission
- Example: Even if company has LEAVE_MANAGEMENT enabled, only HR_MANAGER role can approve leave requests
- Super admin can grant feature access but still control user permissions

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/role.entity.ts` | [NEW] |
| `backend/src/entities/permission.entity.ts` | [NEW] **with featureId** |
| `backend/src/entities/role-permission.entity.ts` | [NEW] |
| `backend/src/entities/user-role.entity.ts` | [NEW] |
| `backend/src/entities/user-permission.entity.ts` | [NEW] |

---

#### Sub-Task: BE-051-2 – Migration & Seeds
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-051-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Remove `users.role` enum column
- Create migration for RBAC tables
- Seed default roles (SUPER_ADMIN, ADMIN, HR_MANAGER, EMPLOYEE)
- Seed common permissions (employees.view, payroll.approve, etc.)

---

### STORY-052: Session Management System
| Field | Value |
|-------|-------|
| **Story ID** | STORY-052 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As a user, I want secure session management so that I can see all my active sessions and revoke them if needed.

#### Sub-Task: BE-052-1 – UserSession Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-052-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `UserSession` entity
- Store hashed refresh tokens (never plaintext)
- Track device metadata (User Agent, IP, Device Name)
- Implement session status (ACTIVE, REVOKED, EXPIRED)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/user-session.entity.ts` | [NEW] |

---

#### Sub-Task: BE-052-2 – Session Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-052-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `SessionService`
- Implement `createSession()` with device fingerprinting
- Implement `revokeSession(sessionId)`
- Implement `revokeAllSessions(userId)`
- Implement `getUserSessions(userId)`

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/session/providers/session.service.ts` | [NEW] |
| `backend/src/modules/session/controllers/session.controller.ts` | [NEW] |

---

#### Sub-Task: BE-052-3 – Update Auth Flow
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-052-3 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Remove `users.refreshToken` column
- Update `AuthService.login()` to create session
- Update `AuthService.refresh()` to validate session
- Update `AuthService.logout()` to revoke session

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/modules/auth/providers/auth.service.ts` | [MODIFY] |

---

### STORY-053: Permission Service
| Field | Value |
|-------|-------|
| **Story ID** | STORY-053 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As the system, I need permission checking logic so that I can enforce access control.

#### Sub-Task: BE-053-1 – Permission Checker
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-053-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `PermissionService`
- Implement `getUserPermissions(userId)` - merge role + override permissions
- Implement `checkPermission(userId, permissionCode)` 
- Cache permissions per user (Redis recommended)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/rbac/providers/permission.service.ts` | [NEW] |

---

#### Sub-Task: BE-053-2 – Enhanced Guards
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-053-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Update `RolesGuard` to use RBAC tables
- Create `@RequirePermission()` decorator
- Create `PermissionsGuard`

**Files to Modify:**
| File | Change |
|------|--------|
| `backend/src/guards/roles.guard.ts` | [MODIFY] |
| `backend/src/guards/permissions.guard.ts` | [NEW] |

---

### STORY-057: Feature + Permission Double-Gating
| Field | Value |
|-------|-------|
| **Story ID** | STORY-057 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 3 |

**Description:**  
As the system, I need to check both feature access AND user permissions, so that companies can only use purchased features AND users can only perform actions they're authorized to do.

#### Sub-Task: BE-057-1 – Combined Access Guard
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-057-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create `CombinedAccessGuard` that checks both feature AND permission
- Integrate with `FeatureAccessService` and `PermissionService`
- Return specific error messages:
  - Feature not enabled → Upgrade prompt
  - Permission denied → Contact admin
- Support `@RequireAccess({ feature: 'LEAVE_MANAGEMENT', permission: 'leave_requests.approve' })`

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/guards/combined-access.guard.ts` | [NEW] |
| `backend/src/common/decorators/require-access.decorator.ts` | [NEW] |

**Example Logic:**
```typescript
@Injectable()
export class CombinedAccessGuard implements CanActivate {
  constructor(
    private featureAccess: FeatureAccessService,
    private permissions: PermissionService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { featureCode, permissionCode } = this.reflector.get(...);
    const user = context.switchToHttp().getRequest().user;
    
    // 1. Check feature access (company-level)
    const hasFeature = await this.featureAccess.checkFeatureAccess(
      user.companyId,
      featureCode
    );
    
    if (!hasFeature) {
      throw new FeatureNotAvailableException(
        `Your plan does not include ${featureCode}. Upgrade to unlock.`
      );
    }
    
    // 2. Check permission (user-level)
    const hasPermission = await this.permissions.checkPermission(
      user.id,
      permissionCode
    );
    
    if (!hasPermission) {
      throw new ForbiddenException(
        `You don't have permission to ${permissionCode}`
      );
    }
    
    return true;
  }
}
```

**Usage Example:**
```typescript
@Controller('leave-requests')
export class LeaveRequestController {
  @Post()
  @UseGuards(JwtAuthGuard, CombinedAccessGuard)
  @RequireAccess({
    feature: 'LEAVE_MANAGEMENT',
    permission: 'leave_requests.create'
  })
  async create() {
    // Only accessible if:
    // 1. Company has LEAVE_MANAGEMENT feature enabled, AND
    // 2. User has permission to create leave requests
  }
  
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, CombinedAccessGuard)
  @RequireAccess({
    feature: 'LEAVE_MANAGEMENT',
    permission: 'leave_requests.approve'
  })
  async approve() {
    // Only accessible if:
    // 1. Company has LEAVE_MANAGEMENT feature enabled, AND
    // 2. User has permission to APPROVE leave (likely HR_MANAGER only)
  }
}
```

---

### STORY-054: Role Management UI
| Field | Value |
|-------|-------|
| **Story ID** | STORY-054 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an admin, I want to manage roles and permissions so that I can control access without code changes.

#### Sub-Task: BE-054-1 – Role CRUD API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-054-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `RoleService` with CRUD
- Implement `assignPermissionsToRole(roleId, permissionIds[])`
- Implement `assignRoleToUser(userId, roleId, expiresAt?)`

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/rbac/providers/role.service.ts` | [NEW] |
| `backend/src/modules/rbac/controllers/role.controller.ts` | [NEW] |

---

#### Sub-Task: FE-054-1 – Roles Page
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-054-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create Roles list page with table
- Create Role creation/edit dialog
- Create Permission assignment interface (checklist)

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/settings/roles/page.tsx` | [NEW] |
| `frontend/components/admin/rbac/role-dialog.tsx` | [NEW] |

---

### STORY-055: Active Sessions UI
| Field | Value |
|-------|-------|
| **Story ID** | STORY-055 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As a user, I want to see my active sessions so that I can revoke suspicious ones.

#### Sub-Task: FE-055-1 – Sessions Page
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-055-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create "Active Sessions" page under user profile
- Display device name, IP, last seen, current session indicator
- Add "Revoke" button per session
- Add "Revoke All Other Sessions" button

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/profile/sessions/page.tsx` | [NEW] |
| `frontend/components/profile/session-card.tsx` | [NEW] |

---

### STORY-058: Tier-Aware User Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-058 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As a company admin, I want to manage users and assign roles, but only see features/modules that are available in my company's tier, so that I don't get confused by features I can't use.

#### Sub-Task: BE-058-1 – User Management API for Company Admins
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-058-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes Needed:**
- Create endpoints for company admins to manage users (not super admin level)
- `POST /api/users` - Create new user account (check admin limit from tier)
- `GET /api/users` - List users in current company
- `PATCH /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Deactivate user
- `POST /api/users/:id/roles` - Assign role to user
- `DELETE /api/users/:id/roles/:roleId` - Remove role from user
- Enforce tier limits (max admins) when creating ADMIN role users
- Return available features for company tier when listing roles

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/users/controllers/user-management.controller.ts` | [NEW] User CRUD for admins |
| `backend/src/modules/users/dto/create-user.dto.ts` | [NEW] DTOs |

**Tier Validation:**
```typescript
async createUser(companyId: number, dto: CreateUserDto) {
  const company = await this.companies.findOne({ where: { id: companyId } });
  
  // Check if adding admin exceeds tier limit
  if (dto.role === 'ADMIN') {
    const currentAdminCount = await this.users.count({
      where: { companyId, role: 'ADMIN' }
    });
    
    const maxAdmins = company.tierLimits.maxAdmins;
    if (maxAdmins && currentAdminCount >= maxAdmins) {
      throw new TierLimitExceededException(
        `Your ${company.tier} tier is limited to ${maxAdmins} admin accounts. Upgrade to add more.`
      );
    }
  }
  
  // Create user...
}
```

---

#### Sub-Task: FE-058-1 – User Management Page
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-058-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create `app/(admin)/settings/users/page.tsx`
- Display data table with all users in company
- Add "Create User" button
- Show user details: email, roles, status, last login
- Add filter by role
- Show tier limits indicator (e.g., "2/5 admin accounts used")

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/settings/users/page.tsx` | [NEW] Users management page |
| `frontend/components/admin/users/users-table.tsx` | [NEW] Users data table |

---

#### Sub-Task: FE-058-2 – Create/Edit User Dialog with Tier Awareness
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-058-2 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- Create user form dialog
- Show employee dropdown (link user to employee)
- Role assignment multi-select
- **Filter roles** based on company's enabled features
- For roles requiring unavailable features, show disabled + upgrade prompt
- Display tier limit warnings when approaching max admins

**Example UI:**
```tsx
function CreateUserDialog() {
  const { companyFeatures, tier, tierLimits } = useCompanyInfo();
  const { hasFeature } = useFeatureAccess();
  
  return (
    <Dialog>
      <FormField label="Roles">
        {roles.map(role => {
          const isAvailable = hasFeature(role.requiredFeature);
          
          return (
            <Checkbox
              disabled={!isAvailable}
              label={role.name}
              helperText={
                !isAvailable && (
                  <UpgradePrompt 
                    feature={role.requiredFeature}
                    message={`Requires ${role.requiredFeature} feature`}
                  />
                )
              }
            />
          );
        })}
      </FormField>
      
      {/* Admin count warning */}
      {adminCount >= tierLimits.maxAdmins - 1 && (
        <Alert variant="warning">
          You're approaching your admin limit ({adminCount}/{tierLimits.maxAdmins}).
          <Button variant="link">Upgrade to add more</Button>
        </Alert>
      )}
    </Dialog>
  );
}
```

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/components/admin/users/user-dialog.tsx` | [NEW] Form dialog |
| `frontend/components/upgrade-prompt.tsx` | [NEW] Reusable upgrade component |
| `frontend/hooks/use-company-info.ts` | [NEW] Hook for company tier info |

---

#### Sub-Task: FE-058-3 – Role Permissions View (Read-Only)
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-058-3 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes Needed:**
- When viewing a role, show all permissions it includes
- Group permissions by module/feature
- Show which permissions are unavailable due to tier (grayed out + lock icon)
- Add tooltip: "This permission requires [FEATURE_NAME]. Upgrade to unlock."

**Example:**
```
Role: HR Manager

✅ Employee Management
  ✅ employees.view
  ✅ employees.create
  ✅ employees.update

🔒 Leave Management (Requires PRO tier)
  🔒 leave_requests.approve
  🔒 leave_balances.adjust
  
  [Upgrade to PRO to unlock Leave Management]
```

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/components/admin/roles/role-permissions-view.tsx` | [NEW] Permissions display |

---

### STORY-056: User Role Assignment
| Field | Value |
|-------|-------|
| **Story ID** | STORY-056 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to assign roles to users so that they have appropriate permissions.

#### Sub-Task: FE-056-1 – Role Assignment UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-056-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Add "Roles" section to Employee edit dialog
- Multi-select for roles with expiration date
- Display current roles with badges

**Files to Modify:**
| File | Change |
|------|--------|
| `frontend/components/admin/employee/employee-dialog.tsx` | [MODIFY] |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02 (Auth foundation) |
| **Blocks** | All future epics (RBAC required) |

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Hash refresh tokens | Never store sensitive tokens in plaintext |
| Session per device | Allow users to see/revoke individual devices |
| Permission caching | RBAC checks are expensive; cache aggressively |
| Hierarchical roles | Support role inheritance for easier management |
