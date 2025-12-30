import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchTimesheets,
  fetchTimesheetById,
  generateTimesheets,
  TimesheetStatus,
} from '@/store/core/thunks/timesheet-thunks';
import { clearError, clearSelectedTimesheet } from '@/store/core/slices/timesheet-slice';

export function useTimesheetManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { timesheets, selectedTimesheet, loading, error } = useSelector(
    (state: RootState) => state.timesheet
  );

  const loadTimesheets = useCallback(() => {
    dispatch(fetchTimesheets());
  }, [dispatch]);

  const loadTimesheetById = useCallback(
    (id: number) => {
      dispatch(fetchTimesheetById(id));
    },
    [dispatch]
  );

  const handleGenerateTimesheets = useCallback(
    async (payPeriodId: number) => {
      return dispatch(generateTimesheets({ payPeriodId })).unwrap();
    },
    [dispatch]
  );

  const handleUpdateEntry = useCallback(
    async (timesheetId: number, entryId: number, data: any) => {
      const { updateTimesheetEntry } = await import('@/store/core/thunks/timesheet-thunks');
      return dispatch(updateTimesheetEntry({ timesheetId, entryId, data })).unwrap();
    },
    [dispatch]
  );
  
  const handleUpdateStatus = useCallback(
     async (id: number, status: any) => {
        const { updateTimesheetStatus } = await import('@/store/core/thunks/timesheet-thunks');
        return dispatch(updateTimesheetStatus({ id, status })).unwrap();
     },
     [dispatch]
  );

  const handlePopulateDays = useCallback(
    async (timesheetId: number) => {
      const { populateTimesheetDays } = await import('@/store/core/thunks/timesheet-thunks');
      return dispatch(populateTimesheetDays(timesheetId)).unwrap();
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelected = useCallback(() => {
    dispatch(clearSelectedTimesheet());
  }, [dispatch]);

  return {
    timesheets,
    selectedTimesheet,
    isLoading: loading,
    error,
    loadTimesheets,
    loadTimesheetById,
    generateTimesheets: handleGenerateTimesheets,
    updateEntry: handleUpdateEntry,
    updateStatus: handleUpdateStatus,
    populateDays: handlePopulateDays,
    clearError: handleClearError,
    clearSelectedTimesheet: handleClearSelected,
    TimesheetStatus,
  };
}

