# Epic 2: Authentication, Authorization, and User Management

## Feature: Authentication (Employee + Admin)
- [x] Implement login flow for employees using Employee Number + optional PIN
  - [x] Create employee login UI
  - [x] Implement API endpoint for employee authentication
  - [x] Implement session/token storage and renewal
- [x] Implement admin login (email/username + password)
  - [x] Create admin login UI
  - [x] Implement API endpoint for admin authentication

## Feature: Authorization and role-based access control
- [x] Implement RBAC middleware/guards on backend
  - [x] Define permissions (e.g., view/edit timesheets, generate payslips, manage employees)
- [x] Implement frontend route guards and UI gating
  - [x] Hide admin-only actions from employee UI

## Feature: Employee and admin account management (Admin-facing)
- [x] Implement CRUD for employees (create, activate/deactivate, update details)
  - [x] Create admin UI for employee list + employee detail
  - [x] Implement API endpoints for employee CRUD
  - [x] Add validation (unique employee number, required fields)
- [x] Implement password/PIN management
  - [x] Implement admin reset PIN/password actions
  - [x] Implement employee change PIN/password (optional)
