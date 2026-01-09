# EPIC-14.2: Performance Management - Reviews & Competencies

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-14.2 |
| **Epic Name** | Performance Management System - Part 2 (Reviews & Ratings) |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 18 |
| **Story Points** | 21 |

---

## Purpose

Complete performance management with 360-degree reviews, competency ratings, and performance analytics.

---

## Stories

### STORY-073: Performance Reviews
| Field | Value |
|-------|-------|
| **Story ID** | STORY-073 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As a manager, I want to conduct performance reviews so that employee performance is documented.

#### Sub-Task: BE-073-1 – Review Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-073-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Review` entity
- Support reviewer types (SELF, MANAGER, PEER, SUBORDINATE)
- Store overall rating and category ratings
- Track strengths and areas for improvement

---

#### Sub-Task: FE-073-1 – Review Forms
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-073-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create review submission form
- Support multi-rater (360) reviews
- Display review summary dashboard

---

### STORY-074: Competency Ratings
| Field | Value |
|-------|-------|
| **Story ID** | STORY-074 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As a reviewer, I want to rate competencies so that skill levels are tracked.

#### Sub-Task: BE-074-1 – Competency Ratings
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-074-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `CompetencyRating` entity
- Link to reviews
- Store rating (1-5) and evidence

---

### STORY-075: Performance Analytics
| Field | Value |
|-------|-------|
| **Story ID** | STORY-075 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 3 |

**Description:**  
As an HR manager, I want performance analytics so that trends are visible.

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-14.1 |
| **Blocks** | EPIC-18 (Reporting) |
