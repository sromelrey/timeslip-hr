# EPIC-18: Advanced Reporting & Analytics

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-18 |
| **Epic Name** | Advanced Reporting & Analytics |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 23 |
| **Story Points** | 21 |

---

## Purpose

Implement comprehensive reporting system with customizable dashboards, data exports, and HR analytics.

---

## Stories

### STORY-085: Report Builder
| Field | Value |
|-------|-------|
| **Story ID** | STORY-085 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an admin, I want to build custom reports so that I can analyze data.

#### Sub-Task: BE-085-1 – Reporting Engine
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-085-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create flexible query builder API
- Support filters, grouping, aggregations
- Generate Excel/CSV exports
- Cache report results

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/modules/reports/providers/report-engine.service.ts` | [NEW] |

---

#### Sub-Task: FE-085-1 – Report Builder UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-085-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create drag-and-drop report builder
- Support saved report templates
- Display charts and visualizations

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/reports/builder/page.tsx` | [NEW] |

---

### STORY-086: HR Analytics Dashboard
| Field | Value |
|-------|-------|
| **Story ID** | STORY-086 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an HR manager, I want analytics dashboards so that I can track key metrics.

#### Sub-Task: FE-086-1 – Analytics Dashboards
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-086-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create headcount analytics
- Create turnover rate tracking
- Create time-to-hire metrics
- Create performance distribution charts

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/analytics/page.tsx` | [NEW] |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | All previous epics |
| **Blocks** | None |
