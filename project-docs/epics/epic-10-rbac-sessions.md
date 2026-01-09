# EPIC-10: RBAC & Advanced Session Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-10 |
| **Epic Name** | Role-Based Access Control & Advanced Session Management |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Sprint** | Sprint 9-10 |
| **Story Points** | 34 |

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
- Create `Permission` entity with module + action structure
- Create `RolePermission` junction entity
- Create `UserRole` entity with expiration support
- Create `UserPermission` entity for overrides

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/role.entity.ts` | [NEW] |
| `backend/src/entities/permission.entity.ts` | [NEW] |
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
