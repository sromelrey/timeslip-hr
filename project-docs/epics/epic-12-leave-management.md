# EPIC-12: Leave Management System

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-12 |
| **Epic Name** | Leave Management System |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Sprint** | Sprint 12-13 |
| **Story Points** | 34 |

---

## Purpose

Implement comprehensive leave/vacation management with accrual tracking, balance calculation, request workflows, and holiday calendar management.

---

## Stories

### STORY-060: Leave Types & Policies
| Field | Value |
|-------|-------|
| **Story ID** | STORY-060 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to configure leave types so that different absence categories are tracked separately.

#### Sub-Task: BE-060-1 – Leave Type Config
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-060-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `LeaveType` entity
- Support paid/unpaid configuration
- Configure accrual rules and max carryover

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/leave-type.entity.ts` | [NEW] |
| `backend/src/modules/leave/providers/leave-type.service.ts` | [NEW] |

---

### STORY-061: Leave Balance Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-061 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As the system, I need to track leave balances so that accruals and usage are calculated.

#### Sub-Task: BE-061-1 – Balance Calculation
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-061-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `LeaveBalance` entity
- Calculate: `balance = entitlement + carriedOver + adjustment - used - pending`
- Implement annual accrual job
- Support manual adjustments with reason

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/leave-balance.entity.ts` | [NEW] |
| `backend/src/modules/leave/providers/balance.service.ts` | [NEW] |

---

### STORY-062: Leave Requests
| Field | Value |
|-------|-------|
| **Story ID** | STORY-062 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an employee, I want to request leave so that my absences are properly documented and approved.

#### Sub-Task: BE-062-1 – Request Workflow
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-062-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `LeaveRequest` entity
- Support half-day requests
- Calculate working days (exclude weekends/holidays)
- Implement approval workflow (DRAFT → PENDING → APPROVED → REJECTED)
- Reserve balance when pending, deduct when approved

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/leave-request.entity.ts` | [NEW] |
| `backend/src/modules/leave/providers/request.service.ts` | [NEW] |

---

#### Sub-Task: FE-062-1 – Employee Leave Portal
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-062-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create leave request page for employees
- Show current balances by type
- Create request form with date range picker
- List request history with status

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/portal/leave/page.tsx` | [NEW] |
| `frontend/components/portal/leave/request-dialog.tsx` | [NEW] |

---

#### Sub-Task: FE-062-2 – Admin Approval UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-062-2 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create pending approvals queue
- Add bulk approve/reject actions
- Show employee balance before approval

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/leave/approvals/page.tsx` | [NEW] |

---

### STORY-063: Holiday Calendar
| Field | Value |
|-------|-------|
| **Story ID** | STORY-063 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to manage holidays so that leave calculations exclude non-working days.

#### Sub-Task: BE-063-1 – Holiday Management
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-063-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Holiday` entity
- Support branch-specific holidays
- Support holiday types (REGULAR, SPECIAL_NON_WORKING, SPECIAL_WORKING)
- Implement recurring holidays

---

#### Sub-Task: FE-063-1 – Holiday Calendar UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-063-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create holiday management page with calendar view
- Add holiday creation dialog

---

### STORY-064: Leave Analytics
| Field | Value |
|-------|-------|
| **Story ID** | STORY-064 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to see leave statistics so that I can plan resources.

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-03 (Time), EPIC-11 (Schedules) |
| **Blocks** | EPIC-18 (Reporting) |
