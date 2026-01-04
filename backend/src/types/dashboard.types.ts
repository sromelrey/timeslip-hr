export interface DashboardStats {
  totalEmployees: number;
  attendanceToday: {
    present: number;
    total: number;
    percentage: number;
  };
  pendingApprovals: {
    timesheets: number;
    payslips: number;
  };
}
