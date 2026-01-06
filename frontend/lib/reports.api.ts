import api from './api';

export interface TimesheetExportParams {
  employeeId?: number;
  departmentId?: number;
  costCenterId?: number;
  payPeriodId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AttendanceSummaryParams {
  startDate: string;
  endDate: string;
  departmentId?: number;
  costCenterId?: number;
  includeAnomalies?: boolean;
  sortOrder?: 'asc' | 'desc';
}

export const exportTimesheets = async (params: TimesheetExportParams): Promise<Blob> => {
  const response = await api.post('/reports/timesheet-export', params, {
    responseType: 'blob',
  });
  return response.data;
};

export const generateAttendanceSummary = async (params: AttendanceSummaryParams): Promise<Blob> => {
  const response = await api.post('/reports/attendance-summary', params, {
    responseType: 'blob',
  });
  return response.data;
};
