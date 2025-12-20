import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export type EmploymentType = 'HOURLY' | 'SALARIED' | 'DAILY';

export interface Employee {
  id: number;
  companyId: number;
  employeeNumber: number;
  firstName: string;
  lastName: string;
  department?: string;
  position?: string;
  employmentType: EmploymentType;
  isActive: boolean;
  hiredAt?: string;
  terminatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  companyId: number;
  firstName: string;
  lastName: string;
  department?: string;
  position?: string;
  employmentType: EmploymentType;
  isActive?: boolean;
  hiredAt?: string;
  terminatedAt?: string;
  rate?: number;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  department?: string;
  position?: string;
  employmentType?: 'HOURLY' | 'SALARIED';
  isActive?: boolean;
  hiredAt?: string;
  terminatedAt?: string;
}

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Employee[]>('/employees');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  'employee/fetchEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Employee>(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (dto: CreateEmployeeDto, { rejectWithValue }) => {
    try {
      const response = await api.post<Employee>('/employees', dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, dto }: { id: number; dto: UpdateEmployeeDto }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Employee>(`/employees/${id}`, dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);
