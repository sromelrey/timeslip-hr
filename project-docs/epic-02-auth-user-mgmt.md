# Epic 2: Authentication, Authorization, and User Management

## Feature: Authentication (Employee + Admin)
- [ ] Implement login flow for employees using Employee Number + optional PIN
  - [ ] Create employee login UI
  - [ ] Implement API endpoint for employee authentication
  - [ ] Implement session/token storage and renewal
- [ ] Implement admin login (email/username + password)
  - [ ] Create admin login UI
  - [ ] Implement API endpoint for admin authentication

## Feature: Authorization and role-based access control
- [ ] Implement RBAC middleware/guards on backend
  - [ ] Define permissions (e.g., view/edit timesheets, generate payslips, manage employees)
- [ ] Implement frontend route guards and UI gating
  - [ ] Hide admin-only actions from employee UI

## Feature: Employee and admin account management (Admin-facing)
- [ ] Implement CRUD for employees (create, activate/deactivate, update details)
  - [ ] Create admin UI for employee list + employee detail
  - [ ] Implement API endpoints for employee CRUD
  - [ ] Add validation (unique employee number, required fields)
- [ ] Implement password/PIN management
  - [ ] Implement admin reset PIN/password actions
  - [ ] Implement employee change PIN/password (optional)
