import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Employee } from './employee-thunks';

// Types (mirrors backend entities)
export enum TimesheetStatus {
  DRAFT = 'DRAFT',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED',
}

export interface TimesheetDay {
  id: number;
  timesheetId: number;
  workDate: string; // YYYY-MM-DD
  regularMinutes: number;
  breakMinutes: number;
  overtimeMinutes: number;
  anomaliesJson?: string;
}

export interface Timesheet {
  id: number;
  employeeId: number;
  employee?: Employee;
  payPeriodId: number;
  payPeriod?: any; // Define PayPeriod interface if needed
  status: TimesheetStatus;
  days?: TimesheetDay[];
  generatedAt?: string;
}

// DTOs
export interface GenerateTimesheetDto {
  payPeriodId: number;
}

// Thunks
export const fetchTimesheets = createAsyncThunk(
  'timesheet/fetchTimesheets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Timesheet[]>('/timesheets');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timesheets');
    }
  }
);

export interface UpdateTimesheetEntryDto {
  regularMinutes?: number;
  overtimeMinutes?: number;
  breakMinutes?: number;
}

export interface UpdateTimesheetStatusDto {
  status: TimesheetStatus;
}

export const fetchTimesheetById = createAsyncThunk(
  'timesheet/fetchTimesheetById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Timesheet>(`/timesheets/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timesheet details');
    }
  }
);

export const updateTimesheetEntry = createAsyncThunk(
  'timesheet/updateTimesheetEntry',
  async ({ timesheetId, entryId, data }: { timesheetId: number; entryId: number; data: UpdateTimesheetEntryDto }, { rejectWithValue }) => {
    try {
      // Assuming backend endpoint PATCH /timesheets/:id/entries/:entryId
      const response = await api.patch<Timesheet>(`/timesheets/${timesheetId}/entries/${entryId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update entry');
    }
  }
);

export const updateTimesheetStatus = createAsyncThunk(
  'timesheet/updateTimesheetStatus',
  async ({ id, status }: { id: number; status: TimesheetStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Timesheet>(`/timesheets/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);


export const generateTimesheets = createAsyncThunk(
  'timesheet/generateTimesheets',
  async (dto: GenerateTimesheetDto, { rejectWithValue }) => {
    try {
      const response = await api.post<Timesheet[]>('/timesheets/generate', dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate timesheets');
    }
  }
);

export const populateTimesheetDays = createAsyncThunk(
  'timesheet/populateTimesheetDays',
  async (timesheetId: number, { rejectWithValue }) => {
    try {
      const response = await api.post<TimesheetDay[]>(`/timesheets/${timesheetId}/populate`);
      return { timesheetId, days: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to populate timesheet days');
    }
  }
);

// Adjustment types
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
  createdByUser?: { id: number; name: string };
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

// Fetch raw time events for a timesheet
export const fetchRawEvents = createAsyncThunk(
  'timesheet/fetchRawEvents',
  async (timesheetId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<TimeEvent[]>(`/timesheets/${timesheetId}/events`);
      return { timesheetId, events: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch raw events');
    }
  }
);

// Fetch adjustments for a day
export const fetchAdjustments = createAsyncThunk(
  'timesheet/fetchAdjustments',
  async (dayId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<TimesheetAdjustment[]>(`/timesheets/days/${dayId}/adjustments`);
      return { dayId, adjustments: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch adjustments');
    }
  }
);

// Create a new adjustment
export const createAdjustment = createAsyncThunk(
  'timesheet/createAdjustment',
  async ({ dayId, dto }: { dayId: number; dto: CreateAdjustmentDto }, { rejectWithValue }) => {
    try {
      const response = await api.post<TimesheetAdjustment>(`/timesheets/days/${dayId}/adjustments`, dto);
      return { dayId, adjustment: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create adjustment');
    }
  }
);

