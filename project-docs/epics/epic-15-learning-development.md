# EPIC-15: Learning & Development

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-15 |
| **Epic Name** | Learning & Development System |
| **Status** | 📋 Planned |
| **Priority** | Medium |
| **Sprint** | Sprint 19 |
| **Story Points** | 29 |

---

## Purpose

Implement learning management system (LMS) with course catalog, enrollment tracking, and certification management.

---

## Stories

### STORY-076: Course Catalog
| Field | Value |
|-------|-------|
| **Story ID** | STORY-076 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an HR manager, I want to manage courses so that learning opportunities are available.

#### Sub-Task: BE-076-1 – Course Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-076-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Course` entity
- Support course categories and formats
- Track provider and cost
- Set prerequisites

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/course.entity.ts` | [NEW] |

---

#### Sub-Task: FE-076-1 – Course Catalog UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-076-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create course catalog page
- Support filtering by category/format
- Display course availability

---

### STORY-077: Enrollment & Completion
| Field | Value |
|-------|-------|
| **Story ID** | STORY-077 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an employee, I want to enroll in courses so that I can develop skills.

#### Sub-Task: BE-077-1 – Enrollment Tracking
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-077-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Enrollment` entity
- Track status (ENROLLED, IN_PROGRESS, COMPLETED, FAILED)
- Store completion date and score
- Generate certificate URLs

---

#### Sub-Task: FE-077-1 – Learning Portal
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-077-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create employee learning portal
- Display enrolled courses
- Track progress and certificates

---

### STORY-078: Certification Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-078 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As an HR manager, I want to track certifications so that compliance is maintained.

#### Sub-Task: BE-078-1 – Certification System
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-078-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Certification` entity
- Create `CertificationRequiredPosition` junction (normalized)
- Create `EmployeeCertification` for tracking
- Implement expiration reminders

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/certification.entity.ts` | [NEW] |
| `backend/src/entities/certification-required-position.entity.ts` | [NEW] |
| `backend/src/entities/employee-certification.entity.ts` | [NEW] |

---

#### Sub-Task: FE-078-1 – Certification Tracking
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-078-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create certification management page
- Display expiring certifications dashboard
- Link certifications to required positions

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02, EPIC-17 (Documents) |
| **Blocks** | EPIC-18 (Reporting) |
