# EPIC-13.2: Recruitment - Interviews & Offers

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-13.2 |
| **Epic Name** | Recruitment System - Part 2 (Interviews & Offer Letters) |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 15 |
| **Story Points** | 18 |

---

## Purpose

Complete the ATS with interview scheduling, feedback collection, and offer letter generation.

---

## Stories

### STORY-068: Interview Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-068 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an HR manager, I want to schedule interviews so that candidates can be evaluated.

#### Sub-Task: BE-068-1 – Interview & Interviewers
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-068-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Interview` entity with rounds
- Create `InterviewInterviewer` junction table (normalized)
- Support interview types (PHONE, VIDEO, IN_PERSON, TECHNICAL)
- Store feedback JSON and rating

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/interview.entity.ts` | [NEW] |
| `backend/src/entities/interview-interviewer.entity.ts` | [NEW] |

---

#### Sub-Task: FE-068-1 – Interview Scheduling
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-068-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create interview scheduling dialog
- Select multiple interviewers
- Calendar integration for scheduling
- Display interview pipeline per application

---

### STORY-069: Offer Letter Generation
| Field | Value |
|-------|-------|
| **Story ID** | STORY-069 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an HR manager, I want to generate offer letters so that approved candidates can be formally hired.

#### Sub-Task: BE-069-1 – Offer Letter System
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-069-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `OfferLetter` entity
- Generate PDF offers with templates
- Track status (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)
- Link to Employee entity when accepted

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-13.1 |
| **Blocks** | None |
