# EPIC-07: System Settings and Configuration

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-07 |
| **Epic Name** | System Settings and Configuration |
| **Status** | ✅ Done |
| **Priority** | Medium |
| **Sprint** | Sprint 7 |
| **Completion** | January 2026 |
| **Story Points** | 13 |

---

## Purpose

Implement system configuration UI for company settings, time policies, payroll policies, and security settings.

---

## Stories

### STORY-035: General Settings
| Field | Value |
|-------|-------|
| **Story ID** | STORY-035 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an admin, I want to configure company settings so that the system reflects our business.

#### Sub-Task: BE-035-1 – Settings API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-035-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created `Settings` entity
- Implemented GET/UPDATE endpoints for company config

#### Sub-Task: FE-035-1 – Settings Page
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-035-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created Settings layout with tabs
- Implemented General tab (Timezone, Date Format)

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/settings/page.tsx` | [NEW] Settings page |

---

### STORY-036: Time Policies
| Field | Value |
|-------|-------|
| **Story ID** | STORY-036 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to configure time policies so that calculations match our rules.

#### Sub-Task: FE-036-1 – Policy UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-036-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added "Time Policy" tab
- Created controls for Grace Period (mins)
- Created controls for Rounding Rules

---

### STORY-037: Payroll Policies
| Field | Value |
|-------|-------|
| **Story ID** | STORY-037 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to configure payroll policies so that pay calculations are correct.

#### Sub-Task: FE-037-1 – Policy UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-037-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added "Payroll Policy" tab
- Created controls for OT Multiplier
- Created controls for Currency Symbol

---

### STORY-038: Security Settings
| Field | Value |
|-------|-------|
| **Story ID** | STORY-038 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 2 |

**Description:**  
As an admin, I want to configure security policies so that the system is secure.

#### Sub-Task: BE-038-1 – Security Config
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-038-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Added session timeout to config
- Added PIN complexity rules to config

#### Sub-Task: FE-038-1 – Security UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-038-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added "Security" tab
- Created controls for Session Timeout
