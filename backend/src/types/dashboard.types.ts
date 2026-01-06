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
  currentlyClockedIn: number;
  onBreak: number;
  recentActivity: RecentActivityItem[];
}

export interface CurrentlyActiveEmployee {
  id: number;
  name: string;
  department: string;
  clockedInAt: Date;
  status: 'ACTIVE' | 'ON_BREAK';
}

export interface RecentActivityItem {
  id: number;
  employeeName: string;
  eventType: string;
  timestamp: Date;
}
