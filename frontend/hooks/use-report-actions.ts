import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  generateTimesheetExport as generateTimesheetExportThunk,
  generateAttendanceSummary as generateAttendanceSummaryThunk,
} from '@/store/core/thunks/reports-thunks';
import { TimesheetExportParams, AttendanceSummaryParams } from '@/lib/reports.api';

export function useReportActions() {
  const dispatch = useAppDispatch();
  const { loading, error, lastExportDate } = useAppSelector((state) => state.reports);

  const exportTimesheets = async (params: TimesheetExportParams) => {
    const result = await dispatch(generateTimesheetExportThunk(params));
    return generateTimesheetExportThunk.fulfilled.match(result);
  };

  const generateAttendanceSummary = async (params: AttendanceSummaryParams) => {
    const result = await dispatch(generateAttendanceSummaryThunk(params));
    return generateAttendanceSummaryThunk.fulfilled.match(result);
  };

  return {
    exportTimesheets,
    generateAttendanceSummary,
    loading,
    error,
    lastExportDate,
  };
}
