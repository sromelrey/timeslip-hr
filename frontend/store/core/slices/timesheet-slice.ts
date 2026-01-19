import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTimesheets,
  fetchTimesheetById,
  generateTimesheets,
  updateTimesheetEntry,
  updateTimesheetStatus,
  populateTimesheetDays,
  fetchRawEvents,
  Timesheet,
  TimeEvent,
} from '../thunks/timesheet-thunks';

interface TimesheetState {
  timesheets: Timesheet[];
  selectedTimesheet: Timesheet | null;
  rawEvents: TimeEvent[];
  loading: boolean;
  actionLoadingIds: number[]; // Track which rows have actions in progress
  error: string | null;
}

const initialState: TimesheetState = {
  timesheets: [],
  selectedTimesheet: null,
  rawEvents: [],
  loading: false,
  actionLoadingIds: [],
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
      .addCase(generateTimesheets.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateTimesheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Entry
      .addCase(updateTimesheetEntry.fulfilled, (state, action) => {
          state.selectedTimesheet = action.payload;
          const index = state.timesheets.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
              state.timesheets[index] = action.payload;
          }
      })
      // Update Status
      .addCase(updateTimesheetStatus.pending, (state, action) => {
          state.actionLoadingIds.push(action.meta.arg.id);
      })
      .addCase(updateTimesheetStatus.fulfilled, (state, action) => {
          state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== action.payload.id);
          state.selectedTimesheet = action.payload;
          const index = state.timesheets.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
              state.timesheets[index] = action.payload;
          }
      })
      .addCase(updateTimesheetStatus.rejected, (state, action) => {
          state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== action.meta.arg.id);
          state.error = action.payload as string;
      })
      // Populate Days
      .addCase(populateTimesheetDays.pending, (state, action) => {
          state.actionLoadingIds.push(action.meta.arg);
          state.error = null;
      })
      .addCase(populateTimesheetDays.fulfilled, (state, action) => {
          state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== action.payload.timesheetId);
          if (state.selectedTimesheet?.id === action.payload.timesheetId) {
              state.selectedTimesheet.days = action.payload.days;
          }
          const index = state.timesheets.findIndex(t => t.id === action.payload.timesheetId);
          if (index !== -1) {
              state.timesheets[index].days = action.payload.days;
          }
      })
      .addCase(populateTimesheetDays.rejected, (state, action) => {
          state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== action.meta.arg);
          state.error = action.payload as string;
      })
      // Fetch Raw Events
      .addCase(fetchRawEvents.fulfilled, (state, action) => {
          state.rawEvents = action.payload;
      });
  },
});

export const { clearError, clearSelectedTimesheet } = timesheetSlice.actions;
export default timesheetSlice.reducer;
