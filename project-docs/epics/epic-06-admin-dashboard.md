# EPIC-06: Admin Dashboard and Reporting

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-06 |
| **Epic Name** | Admin Dashboard and Reporting |
| **Status** | ✅ Done |
| **Priority** | Medium |
| **Sprint** | Sprint 6-7 |
| **Completion** | January 2026 |
| **Story Points** | 18 |

---

## Purpose

Implement admin dashboard with real-time attendance metrics, recent activity feed, and CSV report exports for timesheets and attendance.

---

## Stories

### STORY-030: Dashboard Stats API
| Field | Value |
|-------|-------|
| **Story ID** | STORY-030 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to see attendance metrics so that I can monitor workforce status.

#### Sub-Task: BE-030-1 – Stats Endpoints
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-030-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created `DashboardService`
- Implemented queries for:
  - Present today count
  - Late/On Time count
  - Pending Approvals count
- Optimized with database indexing

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/dashboard/providers/dashboard.service.ts` | [NEW] Stats logic |
| `backend/src/modules/dashboard/controllers/dashboard.controller.ts` | [NEW] Endpoints |

---

### STORY-031: Dashboard UI
| Field | Value |
|-------|-------|
| **Story ID** | STORY-031 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 5 |

**Description:**  
As an admin, I want a visual dashboard so that I can quickly assess workforce status.

#### Sub-Task: FE-031-1 – Dashboard Layout
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-031-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created Stats Cards (Total Employees, Attendance %)
- Implemented polling interval for refreshing data

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/dashboard/page.tsx` | [NEW] Dashboard page |
| `frontend/components/admin/dashboard/stat-card.tsx` | [NEW] Widget |

---

### STORY-032: Recent Activity Feed
| Field | Value |
|-------|-------|
| **Story ID** | STORY-032 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to see recent time events so that I can monitor employee activity.

#### Sub-Task: FE-032-1 – Activity Feed Component
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-032-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created list component for recent events
- Added relative timestamps (e.g., "5 mins ago")
- Added status icons (Green for Clock In, Amber for Break)

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/components/admin/dashboard/recent-activity.tsx` | [NEW] Feed component |

---

### STORY-033: Timesheet Export
| Field | Value |
|-------|-------|
| **Story ID** | STORY-033 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to export timesheets to CSV so that I can use data externally.

#### Sub-Task: BE-033-1 – CSV Generation
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-033-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `csv-stringify` stream
- Added columns for Regular, OT, and Break hours

#### Sub-Task: FE-033-1 – Export Dialog
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-033-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created Date Range picker
- Added "Download CSV" button action

---

### STORY-034: Attendance Summary Report
| Field | Value |
|-------|-------|
| **Story ID** | STORY-034 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want an attendance report so that I can identify patterns and issues.

#### Sub-Task: BE-034-1 – Report Data
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-034-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created query for daily attendance aggregation
- Flagged Late/Absent status
