# EPIC-11: Shift Patterns & Advanced Scheduling

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-11 |
| **Epic Name** | Shift Patterns & Advanced Scheduling |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 11 |
| **Story Points** | 29 |

---

## Purpose

Implement flexible shift pattern management with normalized work days, employee scheduling, and attendance tracking integrated with time logging.

---

## Stories

### STORY-057: Shift Pattern System
| Field | Value |
|-------|-------|
| **Story ID** | STORY-057 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an admin, I want to create shift patterns so that I can define working schedules for different employee groups.

#### Sub-Task: BE-057-1 – Shift Pattern Entities
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-057-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `ShiftPattern` entity
- Create `ShiftPatternDay` entity (normalized from JSON)
- Support overnight shifts (`isOvernight` flag)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/shift-pattern.entity.ts` | [NEW] |
| `backend/src/entities/shift-pattern-day.entity.ts` | [NEW] |

---

#### Sub-Task: BE-057-2 – Shift Pattern Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-057-2 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Implement `ShiftPatternService` with CRUD
- Validate work days selection (at least 1 day)
- Calculate total weekly hours

---

#### Sub-Task: FE-057-1 – Shift Pattern UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-057-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create Shift Pattern management page
- Create dialog with time pickers
- Add day-of-week multi-select checkboxes

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/settings/shift-patterns/page.tsx` | [NEW] |
| `frontend/components/admin/scheduling/shift-pattern-dialog.tsx` | [NEW] |

---

### STORY-058: Employee Scheduling
| Field | Value |
|-------|-------|
| **Story ID** | STORY-058 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an admin, I want to assign shift patterns to employees so that their schedules are tracked.

#### Sub-Task: BE-058-1 – Schedule Entity & Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-058-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Schedule` entity with effective dates
- Implement schedule assignment logic
- Support schedule changes with history

---

#### Sub-Task: FE-058-1 – Schedule Assignment
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-058-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Add "Assign Schedule" button in employee details
- Create schedule assignment dialog
- Display current and upcoming schedules

---

### STORY-059: Attendance Tracking
| Field | Value |
|-------|-------|
| **Story ID** | STORY-059 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As the system, I need to track attendance against schedules so that late/absent/overtime is calculated.

#### Sub-Task: BE-059-1 – Attendance Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-059-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Compare time events against employee schedule
- Flag late arrivals (with grace period)
- Flag early departures
- Calculate overtime hours

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/attendance/providers/attendance.service.ts` | [NEW] |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-03 (Time Events), EPIC-04 (Timesheets) |
| **Blocks** | EPIC-12 (Leave), EPIC-18 (Reporting) |
