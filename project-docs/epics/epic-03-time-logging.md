# EPIC-03: Employee Time Logging

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-03 |
| **Epic Name** | Employee Time Logging (Clock In/Out + Break In/Out) |
| **Status** | ✅ Done |
| **Priority** | High |
| **Sprint** | Sprint 3-4 |
| **Completion** | December 2025 |
| **Story Points** | 21 |

---

## Purpose

Implement the employee time logging kiosk that allows employees to clock in/out and take breaks, with real-time status display, state machine validation, and audit trail.

---

## Stories

### STORY-013: Time Logging Kiosk UI
| Field | Value |
|-------|-------|
| **Story ID** | STORY-013 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 8 |

**Description:**  
As an employee, I want a simple kiosk interface so that I can clock in/out and take breaks.

#### Sub-Task: FE-013-1 – Kiosk Dashboard
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-013-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created kiosk layout and main page
- Implemented real-time clock widget
- Displayed employee info and current status

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/kiosk/dashboard/page.tsx` | [NEW] Dashboard |
| `frontend/components/kiosk/status-card.tsx` | [NEW] Status display |
| `frontend/components/kiosk/analog-clock.tsx` | [NEW] Clock widget |

---

#### Sub-Task: FE-013-2 – Action Buttons Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-013-2 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created action buttons (Clock In, Clock Out, Break In, Break Out)
- Implemented button disabling based on state
- Integrated `useTimeActions` hook

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/components/kiosk/action-buttons.tsx` | [NEW] Buttons component |
| `frontend/hooks/use-time-actions.ts` | [NEW] Logic hook |

---

### STORY-014: Time Event API
| Field | Value |
|-------|-------|
| **Story ID** | STORY-014 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As the system, I need an API to record time events so that employee actions are persisted.

#### Sub-Task: BE-014-1 – Event Creation Endpoint
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-014-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `POST /time-events` endpoint
- Added DTO validation
- Implemented state machine validation check
- Recorded server-side timestamp

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/time-event/controllers/time-event.controller.ts` | [NEW] Controller |
| `backend/src/modules/time-event/providers/time-event.service.ts` | [NEW] Logic |

---

### STORY-015: State Machine Validation
| Field | Value |
|-------|-------|
| **Story ID** | STORY-015 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 3 |

**Description:**  
As the system, I need to enforce valid state transitions so that invalid sequences are prevented.

#### Sub-Task: BE-015-1 – State Machine Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-015-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created `ValidationService`
- Implemented transition rules (No Break Out without Break In, etc.)
- Added specific error messages for invalid moves

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/time-event/providers/validation.service.ts` | [NEW] State rules |

---

### STORY-016: Idempotency & Server Time
| Field | Value |
|-------|-------|
| **Story ID** | STORY-016 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 2 |

**Description:**  
As the system, I need idempotency protection so that duplicate submissions don't create duplicate events.

#### Sub-Task: BE-016-1 – Idempotency Check
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-016-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Added `requestId` check in service
- Returned existing event if duplicate found

---

### STORY-017: UX States & Error Handling
| Field | Value |
|-------|-------|
| **Story ID** | STORY-017 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 3 |

**Description:**  
As an employee, I want clear feedback so that I know if my action succeeded or failed.

#### Sub-Task: FE-017-1 – Toasts & Loading States
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-017-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Integrated `sonner` for toast notifications
- Added loading spinners to buttons
- Showed specific error messages from backend

---

### STORY-018: Audit Trail
| Field | Value |
|-------|-------|
| **Story ID** | STORY-018 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 2 |

**Description:**  
As an admin, I need audit metadata so that I can track when and where time events occurred.

#### Sub-Task: BE-018-1 – Audit Metadata
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-018-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Captured IP address and User Agent
- Stored metadata in `metaJson` column

