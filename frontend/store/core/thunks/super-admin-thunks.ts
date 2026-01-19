import { createAsyncThunk } from '@reduxjs/toolkit';
import * as superAdminApi from '@/lib/super-admin.api';

export const fetchGlobalStats = createAsyncThunk(
  'superAdmin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getGlobalStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch global stats');
    }
  }
);

export const fetchCompanies = createAsyncThunk(
  'superAdmin/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getCompanies();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
    }
  }
);

export const createCompany = createAsyncThunk(
  'superAdmin/createCompany',
  async (dto: superAdminApi.CreateCompanyDto, { rejectWithValue }) => {
    try {
      return await superAdminApi.createCompany(dto);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'superAdmin/updateCompany',
  async ({ id, dto }: { id: number; dto: Partial<superAdminApi.CreateCompanyDto> }, { rejectWithValue }) => {
    try {
      return await superAdminApi.updateCompany(id, dto);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update company');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'superAdmin/deleteCompany',
  async (id: number, { rejectWithValue }) => {
    try {
      await superAdminApi.deleteCompany(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete company');
    }
  }
);
