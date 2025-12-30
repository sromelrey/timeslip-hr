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
  payPeriod?: PayPeriod;
  days?: TimesheetDay[];
}

export interface PayPeriod {
  id: number;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED';
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

export type AdjustmentField = 'REGULAR' | 'BREAK' | 'OVERTIME';
export type AdjustmentMode = 'DELTA' | 'OVERRIDE';

export interface TimesheetAdjustment {
  id: number;
  timesheetDayId: number;
  field: AdjustmentField;
  mode: AdjustmentMode;
  deltaMinutes: number | null;
  overrideMinutes: number | null;
  reason: string;
  createdByUserId: number;
  createdByUser?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface CreateAdjustmentDto {
  field: AdjustmentField;
  mode: AdjustmentMode;
  deltaMinutes?: number;
  overrideMinutes?: number;
  reason: string;
}

export interface TimeEvent {
  id: number;
  employeeId: number;
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_IN' | 'BREAK_OUT';
  happenedAt: string;
  source: 'KIOSK' | 'WEB' | 'MOBILE';
}

export const timesheetApi = {
  getAll: async (): Promise<Timesheet[]> => {
    const response = await api.get('/timesheets');
    return response.data;
  },

  getPayPeriods: async (): Promise<PayPeriod[]> => {
    const response = await api.get('/timesheets/pay-periods');
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

  // New methods for adjustments and raw events
  getRawEvents: async (timesheetId: number): Promise<TimeEvent[]> => {
    const response = await api.get(`/timesheets/${timesheetId}/events`);
    return response.data;
  },

  createAdjustment: async (dayId: number, dto: CreateAdjustmentDto): Promise<TimesheetAdjustment> => {
    const response = await api.post(`/timesheets/days/${dayId}/adjustments`, dto);
    return response.data;
  },

  getAdjustments: async (dayId: number): Promise<TimesheetAdjustment[]> => {
    const response = await api.get(`/timesheets/days/${dayId}/adjustments`);
    return response.data;
  },
};
