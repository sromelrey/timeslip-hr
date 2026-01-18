import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchTimesheets,
  fetchTimesheetById,
  generateTimesheets,
  fetchRawEvents,
  createAdjustment as createAdjustmentThunk,
  addManualEntry as addManualEntryThunk,
  generateCustomTimesheets,
  TimesheetStatus,
  CreateAdjustmentDto,
  CreateManualEntryDto,
  GenerateCustomTimesheetDto,
} from '@/store/core/thunks/timesheet-thunks';
import { clearError, clearSelectedTimesheet } from '@/store/core/slices/timesheet-slice';

export function useTimesheetManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { timesheets, selectedTimesheet, rawEvents, loading, actionLoadingIds, error } = useSelector(
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

  const loadRawEvents = useCallback(
    (timesheetId: number) => {
      dispatch(fetchRawEvents(timesheetId));
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

  const handleCreateAdjustment = useCallback(
    async (dayId: number, dto: CreateAdjustmentDto) => {
      return dispatch(createAdjustmentThunk({ dayId, dto })).unwrap();
    },
    [dispatch]
  );

  const handleAddManualEntry = useCallback(
    async (timesheetId: number, dto: CreateManualEntryDto) => {
      return dispatch(addManualEntryThunk({ timesheetId, dto })).unwrap();
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelected = useCallback(() => {
    dispatch(clearSelectedTimesheet());
  }, [dispatch]);

  const handleGenerateCustomTimesheets = useCallback(
    async (dto: GenerateCustomTimesheetDto) => {
       return dispatch(generateCustomTimesheets(dto)).unwrap();
    },
    [dispatch]
  );

  return {
    timesheets,
    selectedTimesheet,
    rawEvents,
    isLoading: loading,
    actionLoadingIds,
    error,
    loadTimesheets,
    loadTimesheetById,
    loadRawEvents,
    generateTimesheets: handleGenerateTimesheets,
    generateCustomTimesheets: handleGenerateCustomTimesheets,
    updateEntry: handleUpdateEntry,
    updateStatus: handleUpdateStatus,
    populateDays: handlePopulateDays,
    createAdjustment: handleCreateAdjustment,
    addManualEntry: handleAddManualEntry,
    clearError: handleClearError,
    clearSelectedTimesheet: handleClearSelected,
    TimesheetStatus,
  };
}
