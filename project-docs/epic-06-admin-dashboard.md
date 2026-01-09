# Epic 6: Admin Dashboard and Reporting

## Feature: Admin overview dashboard
- [x] Build dashboard widgets (today's attendance, currently clocked-in, on break)
- [x] Implement API endpoints to support dashboard queries
  - [x] `DashboardService.getStats()` with real-time metrics
  - [x] `DashboardController` wired with `JwtAuthGuard`
- [x] Dashboard UI with auto-refresh (every 5 minutes)
- [x] Recent activity feed with employee time events

## Feature: Reports and exports (basic)
- [x] Implement timesheet export (CSV) by pay period and employee
  - [x] `ReportsController.exportTimesheets()` endpoint
  - [x] `TimesheetExportDialog` component in frontend
- [x] Implement attendance summary report (daily totals, anomalies)
  - [x] `ReportsController.generateAttendanceSummary()` endpoint
  - [x] `AttendanceSummaryDialog` component in frontend
- [x] Add filters and sorting (date range, employee selection)

## Implementation Files

### Backend
- `backend/src/modules/dashboard/dashboard.service.ts`
- `backend/src/modules/dashboard/dashboard.controller.ts`
- `backend/src/modules/reports/reports.controller.ts`
- `backend/src/modules/reports/providers/reports.service.ts`

### Frontend
- `frontend/app/(admin)/dashboard/page.tsx`
- `frontend/app/(admin)/reports/page.tsx`
- `frontend/components/admin/dashboard/StatCard.tsx`
- `frontend/components/admin/dashboard/recent-activity-feed.tsx`
- `frontend/components/admin/reports/timesheet-export-dialog.tsx`
- `frontend/components/admin/reports/attendance-summary-dialog.tsx`
