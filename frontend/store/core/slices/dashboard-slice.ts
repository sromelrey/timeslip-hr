import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDashboardStats, fetchCurrentlyActiveEmployees } from '../thunks/dashboard-thunks';
import { DashboardStats, CurrentlyActiveEmployee } from '@/lib/dashboard.api';

interface DashboardState {
  stats: DashboardStats | null;
  currentlyActive: CurrentlyActiveEmployee[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  currentlyActive: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentlyActiveEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentlyActiveEmployees.fulfilled, (state, action: PayloadAction<CurrentlyActiveEmployee[]>) => {
        state.loading = false;
        state.currentlyActive = action.payload;
      })
      .addCase(fetchCurrentlyActiveEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
