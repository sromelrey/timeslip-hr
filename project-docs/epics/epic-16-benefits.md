# EPIC-16: Benefits Administration

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-16 |
| **Epic Name** | Benefits Administration System |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 20-21 |
| **Story Points** | 26 |

---

## Purpose

Implement employee benefits management with plan enrollment, dependent tracking, and cost calculations.

---

## Stories

### STORY-079: Benefit Plan Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-079 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an HR manager, I want to configure benefit plans so that employees can enroll.

#### Sub-Task: BE-079-1 – Benefit Plan Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-079-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `BenefitPlan` entity
- Support plan types (HEALTH, DENTAL, VISION, LIFE, RETIREMENT, OTHER)
- Configure employee/employer costs
- Define eligibility rules

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/benefit-plan.entity.ts` | [NEW] |

---

#### Sub-Task: FE-079-1 – Plan Configuration UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-079-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create benefit plans management page
- Create plan creation/edit dialog

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/benefits/plans/page.tsx` | [NEW] |

---

### STORY-080: Employee Enrollment
| Field | Value |
|-------|-------|
| **Story ID** | STORY-080 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an employee, I want to enroll in benefits so that I am covered.

#### Sub-Task: BE-080-1 – Enrollment Management
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-080-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `BenefitEnrollment` entity
- Support coverage levels (EMPLOYEE_ONLY, EMPLOYEE_SPOUSE, FAMILY)
- Track enrollment periods and effective dates
- Calculate cost contributions

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/benefit-enrollment.entity.ts` | [NEW] |

---

#### Sub-Task: FE-080-1 – Enrollment Portal
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-080-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create benefits enrollment wizard
- Display plan comparisons
- Show cost breakdowns

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/portal/benefits/page.tsx` | [NEW] |

---

### STORY-081: Dependent Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-081 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an employee, I want to add dependents so that they are covered.

#### Sub-Task: BE-081-1 – Dependent Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-081-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Dependent` entity
- Support relationship types (SPOUSE, CHILD, PARENT, OTHER)
- Validate eligibility

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/dependent.entity.ts` | [NEW] |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02, EPIC-05 (Payroll integration) |
| **Blocks** | None |
