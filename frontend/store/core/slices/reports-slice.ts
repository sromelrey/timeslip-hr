import { createSlice } from '@reduxjs/toolkit';
import {
  generateTimesheetExport,
  generateAttendanceSummary,
} from '../thunks/reports-thunks';

interface ReportsState {
  loading: boolean;
  error: string | null;
  lastExportDate: string | null;
}

const initialState: ReportsState = {
  loading: false,
  error: null,
  lastExportDate: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Timesheet Export
    builder.addCase(generateTimesheetExport.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateTimesheetExport.fulfilled, (state, action) => {
      state.loading = false;
      state.lastExportDate = action.payload;
    });
    builder.addCase(generateTimesheetExport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Attendance Summary
    builder.addCase(generateAttendanceSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateAttendanceSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.lastExportDate = action.payload;
    });
    builder.addCase(generateAttendanceSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
