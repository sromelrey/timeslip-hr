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
