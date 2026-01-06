import api from './api';

export interface Setting {
  id: number;
  companyId: number;
  timezone: string;
  currency: string;
  roundingRule: string;
  breakPolicy: string;
  overtimeRule: string;
  gracePeriodMinutes: number;
  payPeriodType: string;
  defaultHourlyRate?: number;
  sessionDurationMinutes: number;
  passwordPolicy?: string;
  pinPolicy?: string;
  dataRetentionMonths?: number;
}

export const getSettings = async (): Promise<Setting> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (data: Partial<Setting>): Promise<Setting> => {
  const response = await api.patch('/settings', data);
  return response.data;
};
