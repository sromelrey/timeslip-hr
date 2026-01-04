import api from './api';

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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
