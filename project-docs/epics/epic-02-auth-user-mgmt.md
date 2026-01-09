# EPIC-02: Authentication, Authorization, and User Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-02 |
| **Epic Name** | Authentication, Authorization, and User Management |
| **Status** | ✅ Done |
| **Priority** | Critical |
| **Sprint** | Sprint 2–3 |
| **Completion** | December 2025 |
| **Story Points** | 29 |

---

## Purpose

Implement complete authentication system with JWT tokens, role-based access control (RBAC), and employee/admin account management features.

---

## Stories

### STORY-006: Admin Authentication
| Field | Value |
|-------|-------|
| **Story ID** | STORY-006 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an admin, I want to log in with email and password so that I can access the admin dashboard.

#### Sub-Task: BE-006-1 – Auth API & JWT Implementation
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-006-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `AuthService.validateUser()` with Argon2
- Created `signTokens()` for Access/Refresh token generation
- Implemented `/auth/login` endpoint
- Configured `JwtStrategy` for Passport

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/auth/providers/auth.service.ts` | [NEW] Auth logic |
| `backend/src/modules/auth/controllers/auth.controller.ts` | [NEW] Auth endpoints |
| `backend/src/modules/auth/strategies/jwt.strategy.ts` | [NEW] JWT validation |

---

#### Sub-Task: FE-006-1 – Login Page & Integration
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-006-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created sign-in page with React Hook Form
- Integrated login API with `auth-thunks`
- Stored tokens in localStorage
- Added form validation and error handling

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/(auth)/sign-in/page.tsx` | [NEW] Login UI |
| `frontend/store/thunks/auth-thunks.ts` | [MODIFY] Added login thunk |

---

### STORY-007: Employee Kiosk Authentication
| Field | Value |
|-------|-------|
| **Story ID** | STORY-007 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 5 |

**Description:**  
As an employee, I want to log in to the kiosk using my employee number and PIN so that I can clock in/out.

#### Sub-Task: BE-007-1 – PIN Validation Service
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-007-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `EmployeeService.validatePin()`
- Added PIN hashing with Argon2
- Created `/auth/kiosk-login` endpoint

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/employee/providers/employee.service.ts` | [MODIFY] Added PIN methods |

---

#### Sub-Task: FE-007-1 – Kiosk Login UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-007-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created numeric keypad UI for kiosk
- Implemented PIN input field
- Added employee number lookup state

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/kiosk/page.tsx` | [NEW] Kiosk login page |
| `frontend/components/kiosk/keypad.tsx` | [NEW] Numeric entry |

---

### STORY-008: Token Refresh & Logout
| Field | Value |
|-------|-------|
| **Story ID** | STORY-008 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As a user, I want my session to automatically refresh so that I don't have to log in repeatedly.

#### Sub-Task: BE-008-1 – Refresh Token Logic
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-008-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `/auth/refresh` endpoint
- Implemented `/auth/logout` endpoint
- Added refresh token hashing in DB

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/auth/providers/auth.service.ts` | [MODIFY] Added refresh/logout |

---

#### Sub-Task: FE-008-1 – Auto-Refresh Interceptor
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-008-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added Axios interceptor for 401 responses
- Implemented auto-retry after refresh
- Cleared local state on logout

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/lib/api.ts` | [MODIFY] Added interceptors |

---

### STORY-009: Role-Based Access Control
| Field | Value |
|-------|-------|
| **Story ID** | STORY-009 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a system, I need to enforce role-based access so that users can only access features appropriate to their role.

#### Sub-Task: BE-009-1 – RBAC Guards
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-009-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Created `RolesGuard`
- Created `@Roles()` custom decorator
- Applied guards to all admin controllers

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/guards/roles.guard.ts` | [NEW] RBAC logic |
| `backend/src/common/decorators/roles.decorator.ts` | [NEW] Decorator |

---

### STORY-010: Frontend Route Protection
| Field | Value |
|-------|-------|
| **Story ID** | STORY-010 |
| **Status** | ✅ Done |
| **Assignee** | Frontend |
| **Story Points** | 3 |

**Description:**  
As a system, I need to protect frontend routes so that unauthorized users cannot access restricted pages.

#### Sub-Task: FE-010-1 – Middleware Protection
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-010-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Implemented Next.js middleware
- Added route pattern matching for roles
- Configured redirects for unauthorized access

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/middleware.ts` | [NEW] Route guard logic |

---

### STORY-011: Employee CRUD (Admin)
| Field | Value |
|-------|-------|
| **Story ID** | STORY-011 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 8 |

**Description:**  
As an admin, I want to manage employees so that I can add, edit, and deactivate employee records.

#### Sub-Task: BE-011-1 – Employee API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-011-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Implemented `EmployeeService` CRUD
- Added employee number auto-generation (YYYY###)
- Created creation/update DTOs

**Files Created/Modified:**
| File | Change |
|------|--------|
| `backend/src/modules/employee/providers/employee.service.ts` | [NEW] Service |
| `backend/src/modules/employee/controllers/employee.controller.ts` | [NEW] Controller |

---

#### Sub-Task: FE-011-1 – Employee Management UI
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-011-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Created Employee Data Table
- Created Add/Edit Employee Dialog
- Integrated CRUD API endpoints

**Files Created/Modified:**
| File | Change |
|------|--------|
| `frontend/app/(admin)/employee/page.tsx` | [NEW] List page |
| `frontend/components/admin/employee/employee-dialog.tsx` | [NEW] Form dialog |

---

### STORY-012: PIN/Password Management
| Field | Value |
|-------|-------|
| **Story ID** | STORY-012 |
| **Status** | ✅ Done |
| **Assignee** | Full Stack |
| **Story Points** | 3 |

**Description:**  
As an admin, I want to manage employee PINs and passwords so that I can help employees with access issues.

#### Sub-Task: BE-012-1 – Set PIN API
| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-012-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes Made:**
- Added `PATCH /employee/:id/pin` endpoint
- Implemented admin password reset logic

#### Sub-Task: FE-012-1 – Reset UI actions
| Field | Value |
|-------|-------|
| **Sub-Task ID** | FE-012-1 |
| **Status** | ✅ Done |
| **Type** | Frontend |

**Changes Made:**
- Added "Reset PIN" action in employee dropdown
- Added confirmation dialog
