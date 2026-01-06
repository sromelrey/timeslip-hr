import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getCurrentlyActive } from '@/lib/dashboard.api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await getDashboardStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchCurrentlyActiveEmployees = createAsyncThunk(
  'dashboard/fetchCurrentlyActive',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentlyActive();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch active employees'
      );
    }
  }
);
