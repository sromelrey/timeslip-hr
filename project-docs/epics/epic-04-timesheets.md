# EPIC-04: Timesheet Generation and Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-04 |
| **Epic Name** | Timesheet Generation and Management |
| **Status** | ✅ Done |
| **Priority** | High |
| **Sprint** | Sprint 4-5 |
| **Completion** | December 2025 |
| **Story Points** | 21 |

---

## Purpose

Implement automated timesheet generation from time events, admin review/correction workflows, and approval status management.

---

## Stories

### STORY-019: Timesheet Generation Service
| Field | Value |
|-------|-------|
| **Story ID** | STORY-019 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As the system, I need to compute daily timesheets from time events so that hours are automatically calculated.

#### Sub-Task: BE-019-1 – Generation Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-019-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `TimesheetService.generate()`
- Created logic to aggregate events into sessions
- Calculated Regular, Break, Overtime minutes
- Flagged anomalies (Missed punches)

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/timesheet/providers/timesheet.service.ts` | [NEW] Core logic |
| `backend/src/modules/timesheet/providers/timesheet-calculator.ts` | [NEW] Math logic |

---

### STORY-020: Timesheet Admin UI
| Field | Value |
|-------|-------|
| **Story ID** | STORY-020 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to view timesheets so that I can review employee hours.

#### Sub-Task: FE-020-1 – Timesheet List & Filters
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-020-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created Timesheet data table
- Implemented Pay Period selector
- Added Employee and Status filters

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/timesheet/page.tsx` | [NEW] Main page |
| `frontend/components/admin/timesheet/timesheet-table.tsx` | [NEW] Data table |

---

### STORY-021: Timesheet Adjustments
| Field | Value |
|-------|-------|
| **Story ID** | STORY-021 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to adjust timesheet hours so that I can correct errors.

#### Sub-Task: BE-021-1 – Adjustment API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-021-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `POST /timesheet/adjust`
- Recorded original vs new values
- Saved adjustment reason and admin ID

#### Sub-Task: FE-021-1 – Adjustment Dialog
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-021-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created modal for editing hours
- Added reason text area validation
- Connected to adjustment API

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/components/admin/timesheet/adjustment-dialog.tsx` | [NEW] Edit modal |

---

### STORY-022: Status Workflow
| Field | Value |
|-------|-------|
| **Story ID** | STORY-022 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to approve timesheets so that they can proceed to payroll.

#### Sub-Task: BE-022-1 – Status Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-022-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Added transition rules (Draft -> Reviewed -> Approved)
- Prevented edits on Approved timesheets

#### Sub-Task: FE-022-1 – Bulk Actions
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-022-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added "Approve Selected" button
- Added status badges with colors
