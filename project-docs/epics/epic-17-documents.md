# EPIC-17: Document Management System

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-17 |
| **Epic Name** | Document Management System |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Sprint** | Sprint 22 |
| **Story Points** | 18 |

---

## Purpose

Implement secure document storage with version control, expiration tracking, and approval workflows.

---

## Stories

### STORY-082: Document Type Configuration
| Field | Value |
|-------|-------|
| **Story ID** | STORY-082 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an HR manager, I want to configure document types so that required documents are standardized.

#### Sub-Task: BE-082-1 – Document Type Entity
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-082-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `DocumentType` entity
- Configure categories (HR, Legal, Certification)
- Set expiration and reminder rules

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/document-type.entity.ts` | [NEW] |

---

### STORY-083: Document Upload & Storage
| Field | Value |
|-------|-------|
| **Story ID** | STORY-083 |
| **Status** | 📋 Planned |
| **Assignee** | Full Stack |
| **Story Points** | 13 |

**Description:**  
As a user, I want to upload documents so that they are securely stored.

#### Sub-Task: BE-083-1 – Document Entity & Storage
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-083-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create `Document` entity
- Integrate S3/Azure Blob/local storage
- Support versioning
- Implement status workflow (PENDING, APPROVED, REJECTED, EXPIRED)
- Track file metadata (size, MIME type, hash)

**Files to Create:**
| File | Change |
|------|--------|
| `backend/src/entities/document.entity.ts` | [NEW] |
| `backend/src/modules/documents/providers/storage.service.ts` | [NEW] |

---

#### Sub-Task: FE-083-1 – Upload Interface
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-083-1 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Changes to Make:**
- Create document upload component
- Support drag-and-drop
- Display upload progress
- Show document list with download links

**Files to Create:**
| File | Change |
|------|--------|
| `frontend/components/documents/upload-dialog.tsx` | [NEW] |
| `frontend/app/(admin)/documents/page.tsx` | [NEW] |

---

### STORY-084: Expiration & Reminders
| Field | Value |
|-------|-------|
| **Story ID** | STORY-084 |
| **Status** | 📋 Planned |
| **Assignee** | Backend |
| **Story Points** | 2 |

**Description:**  
As the system, I need to send reminders so that documents are renewed before expiration.

#### Sub-Task: BE-084-1 – Reminder System
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-084-1 |
| **Status** | 📋 Planned |
| **Type** | Backend |

**Changes to Make:**
- Create scheduled job to check expiring documents
- Send email notifications
- Update document status to EXPIRED

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | EPIC-02 |
| **Blocks** | EPIC-13 (Recruitment), EPIC-15 (L&D) |
