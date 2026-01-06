import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  exportTimesheets,
  generateAttendanceSummary as generateAttendanceSummaryAPI,
  TimesheetExportParams,
  AttendanceSummaryParams,
} from '@/lib/reports.api';

// Utility function for blob download
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export const generateTimesheetExport = createAsyncThunk(
  'reports/generateTimesheetExport',
  async (params: TimesheetExportParams, { rejectWithValue }) => {
    try {
      const blob = await exportTimesheets(params);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `timesheets-${timestamp}.csv`);
      return new Date().toISOString();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Export failed'
      );
    }
  }
);

export const generateAttendanceSummary = createAsyncThunk(
  'reports/generateAttendanceSummary',
  async (params: AttendanceSummaryParams, { rejectWithValue }) => {
    try {
      const blob = await generateAttendanceSummaryAPI(params);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `attendance-summary-${timestamp}.csv`);
      return new Date().toISOString();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Report generation failed'
      );
    }
  }
);
