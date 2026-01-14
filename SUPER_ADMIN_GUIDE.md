# Super Admin Guide

The `SUPER_ADMIN` role provides global oversight and management capabilities for the entire Timekeeper system. Unlike regular `ADMIN` users who are tied to a specific company, a Super Admin operates at a system-wide level.

## Accessing the Super Admin Dashboard

1. Log in with your Super Admin credentials at `/sign-in`.
2. You will be automatically redirected to `/super-admin/dashboard`.
3. Navigation is handled via the specialized System Admin sidebar.

## Core Features

### 1. Global System Statistics
View aggregated data across all companies, including:
- **Total Companies**: Count of active organizations in the system.
- **Total Users**: Total administrative and kiosk users.
- **Total Employees**: Total workforce registered across all companies.

### 2. Company Management
Manage the lifecycle of organizations in the system:
- **List Companies**: View all registered companies in a searchable, sortable data table.
- **Create Company**: Provision new companies with a name.
- **Edit Company**: Update organization details.
- **Admin Provisioning**: Directly create the first (or additional) `ADMIN` users for any company, allowing you to hand off managed organizations to their owners.
- **Deactivate/Delete**: Soft-remove companies from the system.

## Security and Authentication
- Super Admin routes are protected by `JwtAuthGuard` and a specific `RolesGuard(UserRole.SUPER_ADMIN)`.
- Global middleware prevents unauthorized access from regular users to `/super-admin/*` routes.
- The `companyId` for a Super Admin is `null`, ensuring they are not restricted by company-specific data filters.

## Developer Notes
- Backend Module: `backend/src/modules/super-admin/`
- Frontend Routes: `frontend/app/super-admin/`
- Redux Slice: `superAdmin` in `frontend/store/core/slices/super-admin-slice.ts`

## Verification
For rigorous verification of these features, refer to the [Regression Testing Guide](file:///c:/Users/ROMEL/Desktop/Romel%20Documents/development/Personal%20Passion/timeslip-hr/project-docs/REGRESSION-TESTING-GUIDE.md), specifically **Regression Flow 0: Super Admin Global Operations**.
