import api from './api';

export interface Timesheet {
  id: number;
  employeeId: number;
  payPeriodId: number;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'LOCKED';
  generatedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  lockedAt: string | null;
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: number;
  };
  payPeriod?: {
    id: number;
    startDate: string;
    endDate: string;
  };
  days?: TimesheetDay[];
}

export interface TimesheetDay {
  id: number;
  timesheetId: number;
  workDate: string;
  regularMinutes: number;
  breakMinutes: number;
  overtimeMinutes: number;
  anomaliesJson: string | null;
}

export const timesheetApi = {
  getAll: async (): Promise<Timesheet[]> => {
    const response = await api.get('/timesheets');
    return response.data;
  },

  getOne: async (id: number): Promise<Timesheet> => {
    const response = await api.get(`/timesheets/${id}`);
    return response.data;
  },

  generate: async (payPeriodId: number): Promise<Timesheet[]> => {
    const response = await api.post('/timesheets/generate', { payPeriodId });
    return response.data;
  },

  populateDays: async (id: number): Promise<TimesheetDay[]> => {
    const response = await api.post(`/timesheets/${id}/populate`);
    return response.data;
  },

  updateStatus: async (id: number, status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'LOCKED'): Promise<Timesheet> => {
    const response = await api.patch(`/timesheets/${id}/status`, { status });
    return response.data;
  },
};
