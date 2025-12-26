import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { timeEventApi, CreateTimeEventPayload, TimeEvent } from '@/lib/time-event.api';
import { TimeEventType } from '@/lib/enums';

interface TimeEventState {
  serverTime: string | null;
  currentStatus: TimeEventType | 'CLOCKED_OUT' | null;
  recentEvents: TimeEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: TimeEventState = {
  serverTime: null,
  currentStatus: null,
  recentEvents: [],
  loading: false,
  error: null,
};

export const fetchServerTime = createAsyncThunk('timeEvent/fetchServerTime', async () => {
  return await timeEventApi.getServerTime();
});

export const fetchEmployeeStatus = createAsyncThunk(
  'timeEvent/fetchEmployeeStatus',
  async (employeeNumber: string) => {
    return await timeEventApi.getEmployeeStatus(employeeNumber);
  }
);

export const fetchRecentEvents = createAsyncThunk(
  'timeEvent/fetchRecentEvents',
  async (employeeNumber: string) => {
    return await timeEventApi.getRecentEvents(employeeNumber);
  }
);

export const submitTimeEvent = createAsyncThunk(
  'timeEvent/submitTimeEvent',
  async (payload: CreateTimeEventPayload, { rejectWithValue }) => {
    try {
      return await timeEventApi.createTimeEvent(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record event');
    }
  }
);

const timeEventSlice = createSlice({
  name: 'timeEvent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.currentStatus = null;
      state.recentEvents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Server Time
      .addCase(fetchServerTime.fulfilled, (state, action) => {
        state.serverTime = action.payload.serverTime;
      })
      // Employee Status
      .addCase(fetchEmployeeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.status;
      })
      .addCase(fetchEmployeeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch status';
      })
      // Recent Events
      .addCase(fetchRecentEvents.fulfilled, (state, action) => {
        state.recentEvents = action.payload;
      })
      // Submit Event
      .addCase(submitTimeEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTimeEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.type;
        // Optimization: update recent events locally if needed
      })
      .addCase(submitTimeEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetState } = timeEventSlice.actions;
export default timeEventSlice.reducer;
