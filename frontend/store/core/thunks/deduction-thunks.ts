import { AppDispatch } from '../..';
import * as deductionApi from '../../../lib/deduction.api';
import {
  setLoading,
  setError,
  setDeductions,
  addDeduction,
  updateDeduction,
  removeDeduction,
  setSelectedDeduction,
} from '../slices/deduction-slice';

// Fetch all deductions, optionally filtered by employee
export const fetchDeductions =
  (employeeId?: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const deductions = await deductionApi.getDeductions(employeeId);
      dispatch(setDeductions(deductions));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch deductions'));
    } finally {
      dispatch(setLoading(false));
    }
  };

// Fetch single deduction
export const fetchDeduction = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const deduction = await deductionApi.getDeduction(id);
    dispatch(setSelectedDeduction(deduction));
    return deduction;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch deduction';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Create new deduction
export const createDeduction =
  (dto: deductionApi.CreateDeductionDto) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const deduction = await deductionApi.createDeduction(dto);
      dispatch(addDeduction(deduction));
      return deduction;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create deduction';
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

// Update existing deduction
export const updateDeductionThunk =
  (id: number, dto: deductionApi.UpdateDeductionDto) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const deduction = await deductionApi.updateDeduction(id, dto);
      dispatch(updateDeduction(deduction));
      return deduction;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update deduction';
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

// Delete deduction
export const deleteDeduction = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await deductionApi.deleteDeduction(id);
    dispatch(removeDeduction(id));
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to delete deduction';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};
