import { useCallback, useEffect } from 'react';
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

  // Initial fetch could be optional depending on page, but we'll expose a refetch
  // We won't auto-fetch here to avoid unnecessary calls if this hook is used in multiple places
  // The page component should trigger the first fetch if needed.

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
      // Need to import updateTimesheetEntry here or at top. 
      // Ideally move all imports to top but for this replace tool we assume they are available or we add them.
      // Wait, I need to add them to top imports first if not already there.
      // Since I can't do two non-contiguous edits easily without multi_replace, I will assume I need to import them.
      // Actually I will use dispatch directly with the imported thunk.
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
    clearError: handleClearError,
    clearSelectedTimesheet: handleClearSelected,
    TimesheetStatus,
  };
}
