# EPIC-14.1: Performance Management - Cycles & Goals

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-14.1 |
| **Epic Name** | Performance Management System - Part 1 (Cycles & Goals) |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 16-17 |
| **Story Points** | 26 |

---

## Purpose

Implement performance management foundation with performance cycles, goal setting, and competency frameworks.

---

## Stories

### STORY-070: Performance Cycles
| Field | Value |
|-------|-------|
| **Story ID** | STORY-070 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an HR manager, I want to create performance cycles so that reviews happen on schedule.

#### Sub-Task: BE-070-1 – Performance Cycle Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-070-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `PerformanceCycle` entity
- Support cycle types (ANNUAL, SEMI_ANNUAL, QUARTERLY)
- Track deadlines (goal setting, manager review, self-review)
- Implement status workflow

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/performance-cycle.entity.ts` | [NEW] |

---

### STORY-071: Goal Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-071 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an employee, I want to set goals so that my objectives are tracked.

#### Sub-Task: BE-071-1 – Goal Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-071-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Goal` entity
- Support cascading goals (parentGoalId)
- Track progress (targetValue, currentValue, unit)
- Implement weighted scoring

---

#### Sub-Task: FE-071-1 – Goal Setting UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-071-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create goal management page
- Support SMART goal templates
- Progress tracking visualization

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/portal/performance/goals/page.tsx` | [NEW] |

---

### STORY-072: Competency Framework
| Field | Value |
|-------|-------|
| **Story ID** | STORY-072 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an HR manager, I want to define competencies so that employee skills are standardized.

#### Sub-Task: BE-072-1 – Competency System
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-072-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Competency` entity
- Support competency categories (Core, Technical, Leadership)
- Store level descriptions (1-5 scale)

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02 |
| **Blocks** | EPIC-14.2 (Reviews) |
