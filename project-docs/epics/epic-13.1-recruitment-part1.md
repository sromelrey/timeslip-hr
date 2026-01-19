# EPIC-13.1: Recruitment - Job Postings & Applications

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-13.1 |
| **Epic Name** | Recruitment System - Part 1 (Job Postings & Applications) |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 14 |
| **Story Points** | 21 |

---

## Purpose

Implement applicant tracking system (ATS) foundation with job posting management and application processing.

---

## Stories

### STORY-065: Job Posting Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-065 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an HR manager, I want to create job postings so that we can advertise open positions.

#### Sub-Task: BE-065-1 – Job Posting Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-065-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `JobPosting` entity
- Support rich text descriptions
- Track employment type, experience level, salary range
- Implement status workflow (DRAFT → OPEN → PAUSED → CLOSED → FILLED)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/job-posting.entity.ts` | [NEW] |
| `backend/src/modules/recruitment/providers/job-posting.service.ts` | [NEW] |

---

#### Sub-Task: FE-065-1 – Job Posting Admin
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-065-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create job postings list page
- Create job posting form with rich text editor
- Display posting status and applicant count

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/recruitment/jobs/page.tsx` | [NEW] |
| `frontend/components/admin/recruitment/job-posting-dialog.tsx` | [NEW] |

---

### STORY-066: Application Submission
| Field | Value |
|-------|-------|
| **Story ID** | STORY-066 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As a candidate, I want to apply for jobs so that I can be considered for positions.

#### Sub-Task: BE-066-1 – Application Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-066-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Application` entity
- Store resume URL and cover letter
- Track application source (LinkedIn, Referral, Website)
- Implement status workflow (NEW → SCREENING → INTERVIEW → OFFER → HIRED → REJECTED)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/application.entity.ts` | [NEW] |
| `backend/src/modules/recruitment/providers/application.service.ts` | [NEW] |

---

#### Sub-Task: FE-066-1 – Public Application Form
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-066-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create public job board (unauthenticated)
- Create application submission form
- Support file upload for resume/CV

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/careers/[jobId]/page.tsx` | [NEW] |
| `frontend/app/careers/page.tsx` | [NEW] Job board |

---

### STORY-067: Application Screening
| Field | Value |
|-------|-------|
| **Story ID** | STORY-067 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an HR manager, I want to screen applications so that I can shortlist candidates.

#### Sub-Task: FE-067-1 – Applicant Dashboard
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-067-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create applicant tracking dashboard
- Support filtering by status, job posting
- Add quick screening actions (Shortlist, Reject)
- Display screening score

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/recruitment/applications/page.tsx` | [NEW] |

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02 (Auth), EPIC-17 (Document upload) |
| **Blocks** | EPIC-13.2 (Interviews) |
