import api from './api';
import { TimeEventSource, TimeEventType } from './enums';

export interface CreateTimeEventPayload {
  employeeNumber: string;
  pin?: string;
  type: TimeEventType;
  requestId: string;
  source?: TimeEventSource;
  deviceId?: string;
  metaJson?: string;
}

export interface TimeEvent {
  id: number;
  employeeId: number;
  type: TimeEventType;
  happenedAt: string;
  source: TimeEventSource;
  requestId: string;
  deviceId?: string;
  ipAddress?: string;
  metaJson?: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeNumber: string;
  };
}

export const timeEventApi = {
  getServerTime: async () => {
    const response = await api.get<{ serverTime: string }>('/time-events/server-time');
    return response.data;
  },

  getEmployeeStatus: async (employeeNumber: string) => {
    const response = await api.get<{ status: TimeEventType | 'CLOCKED_OUT' }>(
      `/time-events/status/${employeeNumber}`
    );
    return response.data;
  },

  getRecentEvents: async (employeeNumber: string) => {
    const response = await api.get<TimeEvent[]>(`/time-events/recent/${employeeNumber}`);
    return response.data;
  },

  createTimeEvent: async (payload: CreateTimeEventPayload) => {
    const response = await api.post<TimeEvent>('/time-events', payload);
    return response.data;
  },
};
