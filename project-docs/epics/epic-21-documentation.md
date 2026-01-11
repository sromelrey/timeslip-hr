# EPIC-21: Documentation Updates for Tier & RBAC Systems

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-21 |
| **Epic Name** | Documentation Updates for New Systems |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | TBD |
| **Story Points** | 8 |

---

## Purpose

Update all project documentation to include comprehensive coverage of new systems: tier management, feature access, company features, RBAC, and session management.

---

## Scope

Update the following documentation files:
1. **ADMIN_GUIDE.md** - Add super admin features, tier management, RBAC administration
2. **DEVELOPER_README.md** - Add tier system architecture, feature access guards, RBAC implementation
3. **EMPLOYEE_GUIDE.md** - Add feature access limitations, upgrade prompts
4. **Create SUPER_ADMIN_GUIDE.md** - New guide for super admin tier/company management

---

## Stories

### STORY-060: Update Admin Guide
| Field | Value |
|-------|-------|
| **Story ID** | STORY-060 |
| **Status** | 📋 Planned |
| **Assignee** | Documentation |
| **Story Points** | 3 |

**Description:**  
As an admin, I need updated documentation so that I can understand and use the new RBAC and tier-related features.

#### Sub-Task: DOC-060-1 – Add RBAC Section
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DOC-060-1 |
| **Status** | 📋 Planned |
| **Type** | Documentation |

**Changes Needed:**
Add new section 13 **"Role-Based Access Control (RBAC)"** to ADMIN_GUIDE.md

**Content to Add:**
- Understanding roles vs. permissions
- Managing roles via Settings → Roles
- Assigning roles to users
- Creating custom roles
- Permission structure (module.action)
- Feature-linked permissions
- How to audit role assignments

**Files to Modify:**
| File | Change |
|------|--------|
| `project-docs/guides/ADMIN_GUIDE.md` | [MODIFY] Add section 13 |

---

#### Sub-Task: DOC-060-2 – Add Session Management Section
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DOC-060-2 |
| **Status** | 📋 Planned |
| **Type** | Documentation |

**Changes Needed:**
Add new section 14 **"Active Sessions"** to ADMIN_GUIDE.md

**Content to Add:**
- Viewing active sessions (Profile → Sessions)
- Session details (device, IP, last seen)
- Revoking individual sessions
- Revoking all other sessions
- Security best practices

**Files to Modify:**
| File | Change |
|------|--------|
| `project-docs/guides/ADMIN_GUIDE.md` | [MODIFY] Add section 14 |

---

### STORY-061: Update Developer Documentation
| Field | Value |
|-------|-------|
| **Story ID** | STORY-061 |
| **Status** | 📋 Planned |
| **Assignee** | Documentation |
| **Story Points** | 3 |

**Description:**  
As a developer, I need comprehensive technical documentation for implementing tier-based features and RBAC.

#### Sub-Task: DOC-061-1 – Add Tier System Architecture
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DOC-061-1 |
| **Status** | 📋 Planned |
| **Type** | Documentation |

**Changes Needed:**
Add new section **"10. Tier System"** to DEVELOPER_README.md

**Content to Add:**
- Database schema (features, tier_features, company_features tables)
- Feature access resolution logic
- Company feature overrides (add-ons, trials)
- Using `FeatureAccessService`
- Implementing `@RequireFeature()` decorator
- Example controller protection
- Testing tier limitations

**Files to Modify:**
| File | Change |
|------|--------|
| `project-docs/guides/DEVELOPER_README.md` | [MODIFY] Add section 10 |

---

#### Sub-Task: DOC-061-2 – Add RBAC Implementation Guide
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DOC-061-2 |
| **Status** | 📋 Planned |
| **Type** | Documentation |

**Changes Needed:**
Add new section **"11. RBAC Implementation"** to DEVELOPER_README.md

**Content to Add:**
- RBAC entities (Role, Permission, UserRole, RolePermission)
- Permission checking with `PermissionService`
- Using guards: `@RequirePermission()`, `@RequireAccess()`
- Combined feature + permission checking
- Permission caching strategy
- Seeding default roles and permissions

**Example Code to Include:**
```typescript
// Feature + Permission double-gating
@Controller('leave-requests')
export class LeaveRequestController {
  @Post()
  @UseGuards(JwtAuthGuard, CombinedAccessGuard)
  @RequireAccess({
    feature: 'LEAVE_MANAGEMENT',
    permission: 'leave_requests.create'
  })
  async create() {
    // Protected by both tier feature AND user permission
  }
}
```

**Files to Modify:**
| File | Change |
|------|--------|
| `project-docs/guides/DEVELOPER_README.md` | [MODIFY] Add section 11 |

---

### STORY-062: Create Super Admin Guide
| Field | Value |
|-------|-------|
| **Story ID** | STORY-062 |
| **Status** | 📋 Planned |
| **Assignee** | Documentation |
| **Story Points** | 2 |

**Description:**  
As a super admin, I need dedicated documentation for managing companies, tiers, and feature access across the platform.

#### Sub-Task: DOC-062-1 – Create Super Admin Guide
| Field | Value |
|-------|-------|
| **Sub-Task ID** | DOC-062-1 |
| **Status** | 📋 Planned |
| **Type** | Documentation |

**Changes Needed:**
Create new file: `project-docs/guides/SUPER_ADMIN_GUIDE.md`

**Table of Contents:**
1. Getting Started
   - Super admin role overview
   - Accessing the super admin panel
2. Company Management
   - Viewing all companies
   - Creating new companies
   - Editing company details
   - Setting tier and limits
3. Tier Management
   - Understanding tier structure (FREE/BASIC/PRO/ENTERPRISE)
   - Default tier limits
   - Custom limit overrides
4. Feature Management
   - Master features list
   - Tier-feature defaults
   - Company feature overrides
   - Granting trial access
   - Add-on purchases
5. Usage Monitoring
   - Company usage dashboard
   - Approaching limit alerts
   - Data retention monitoring
6. Best Practices
   - When to override tier defaults
   - Trial durations
   - Tier change workflows
   - Communication with company admins

**Files to Create:**
| File | Change |
|------|--------|
| `project-docs/guides/SUPER_ADMIN_GUIDE.md` | [NEW] Complete guide |

---

## Success Criteria

✅ ADMIN_GUIDE includes RBAC and session management sections  
✅ DEVELOPER_README includes tier system and RBAC implementation guides  
✅ SUPER_ADMIN_GUIDE created with company/tier/feature management  
✅ All code examples tested and accurate  
✅ Screenshots added where helpful  
✅ Cross-references updated in all docs  

---

## Documentation Structure Updates

### Table of Contents Changes

**ADMIN_GUIDE.md:**
```markdown
13. [Role-Based Access Control](#13-role-based-access-control)
14. [Active Sessions](#14-active-sessions)
```

**DEVELOPER_README.md:**
```markdown
10. [Tier System](#10-tier-system)
11. [RBAC Implementation](#11-rbac-implementation)
12. [Session Management](#12-session-management)
```

---

## Code Example Standards

All code examples must:
- Be tested and verified to work
- Include comments explaining key concepts
- Show realistic use cases
- Include error handling where relevant
- Follow project code standards

---

## Screenshot Guidelines

Add screenshots for:
- Super admin company dashboard
- Tier selection UI
- Feature override dialogs
- Role management interface
- Active sessions page
- Upgrade prompts

Screenshots should be:
- Clear and high resolution
- Annotated with arrows/highlights where helpful
- Stored in `project-docs/guides/images/`

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-10 (RBAC), EPIC-20 (Tier Management) |
| **Blocks** | None |

---

## Technical Notes

- Update last modified dates in all guides
- Ensure consistent terminology across all docs
- Link between related sections in different guides
- Add examples from actual implemented code
- Include troubleshooting for common tier/RBAC issues
