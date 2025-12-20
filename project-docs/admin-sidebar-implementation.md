# Implementation Plan: Admin Side Navigation

## Goal
Implement a persistent side navigation bar (sidebar) exclusively for admin accounts to provide quick access to management features.

## Scope
- This sidebar will be integrated into the `(admin)` route group layout.
- It should be visible only when navigating admin-protected pages.

## Proposed Changes

### 1. Components
- **[NEW] Sidebar (`frontend/components/admin/Sidebar.tsx`)**:
    - A vertical navigation component using Tailwind CSS.
    - Links to include:
        - **Dashboard**: `/home` (or `/admin/dashboard`)
        - **Employees**: `/employee`
        - **Timesheets**: `/timesheet`
        - **Payroll**: `/payroll` (placeholder)
        - **Settings**: `/settings` (placeholder)
    - Bottom section: **Logout** button.
    - Active link highlighting based on the current path.
    - Mobile-responsive behavior (collapsible or hamburger menu).

### 2. Layout
- **[NEW] Admin Layout (`frontend/app/(admin)/layout.tsx`)**:
    - A Next.js layout that wraps all routes in the `(admin)` group.
    - Structure:
        - `Sidebar` (fixed or sticky on the left).
        - Main content area (scrollable on the right).
    - Authentication check: Ensure the user is logged in and has the `ADMIN` role before rendering.

### 3. Styling & UX
- Use a clean, professional aesthetic (dark mode compatible).
- Smooth transitions for hover and active states.
- Icons for each navigation item (using `lucide-react`).

## Verification Plan
1. **Navigation**: Click each link and verify it redirects to the correct route.
2. **Active State**: Ensure the sidebar correctly highlights the active route.
3. **Responsiveness**: Check the layout on different screen sizes (desktop, tablet, mobile).
4. **Role Access**: Verify that non-admin accounts (if any) cannot see or access this layout (once RBAC is fully implemented).
