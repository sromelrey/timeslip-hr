import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchTimesheets,
  fetchTimesheetById,
  generateTimesheets,
  updateTimesheetEntry,
  updateTimesheetStatus,
  Timesheet,
} from '../thunks/timesheet-thunks';

interface TimesheetState {
  timesheets: Timesheet[];
  selectedTimesheet: Timesheet | null;
  loading: boolean;
  error: string | null;
}

const initialState: TimesheetState = {
  timesheets: [],
  selectedTimesheet: null,
  loading: false,
  error: null,
};

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedTimesheet(state) {
      state.selectedTimesheet = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchTimesheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.loading = false;
        state.timesheets = action.payload;
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch by ID
    builder
      .addCase(fetchTimesheetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimesheetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTimesheet = action.payload;
      })
      .addCase(fetchTimesheetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Generate
    builder
      .addCase(generateTimesheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTimesheets.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally append new timesheets or just refetch. 
        // For simplicity, we might just assume the user will refetch or we update the list if it returns new ones.
        // The generate endpoint returns the list of created timesheets (or all relevant ones if we changed logic).
        // Let's assume it returns newly created ones. We should probably merge them or just re-fetch.
        // For now, let's just push them if they are unique, or safer: just do nothing and let component refetch.
        // But better UX:
        // state.timesheets = [...state.timesheets, ...action.payload]; 
        // But need to handle duplicates.
        // Let's just leave it for now.
      })
      .addCase(generateTimesheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Entry
      .addCase(updateTimesheetEntry.fulfilled, (state, action) => {
          // Update the selected timesheet with the new data (assuming backend returns the full timesheet)
          state.selectedTimesheet = action.payload;
          // Also update it in the list if present
          const index = state.timesheets.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
              state.timesheets[index] = action.payload;
          }
      })
      // Update Status
      .addCase(updateTimesheetStatus.fulfilled, (state, action) => {
          state.selectedTimesheet = action.payload;
          const index = state.timesheets.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
              state.timesheets[index] = action.payload;
          }
      });
  },
});

export const { clearError, clearSelectedTimesheet } = timesheetSlice.actions;
export default timesheetSlice.reducer;
