import { AppDispatch } from '../..';
import * as payrollApi from '../../../lib/payroll.api';
import {
  setLoading,
  setError,
  setPayPeriods,
  addPayPeriod,
  updatePayPeriod,
  setPayslips,
  addPayslips,
  updatePayslip,
  setSelectedPayslip,
} from '../payroll-slice';

// Pay Period Thunks
export const fetchPayPeriods = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payPeriods = await payrollApi.getPayPeriods();
    dispatch(setPayPeriods(payPeriods));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch pay periods'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPayPeriod =
  (dto: payrollApi.CreatePayPeriodDto) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const payPeriod = await payrollApi.createPayPeriod(dto);
      dispatch(addPayPeriod(payPeriod));
      return payPeriod;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create pay period';
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const closePayPeriod = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payPeriod = await payrollApi.closePayPeriod(id);
    dispatch(updatePayPeriod(payPeriod));
    return payPeriod;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to close pay period';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const reopenPayPeriod = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payPeriod = await payrollApi.reopenPayPeriod(id);
    dispatch(updatePayPeriod(payPeriod));
    return payPeriod;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to reopen pay period';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Payslip Thunks
export const fetchPayslips =
  (payPeriodId?: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const payslips = await payrollApi.getPayslips(payPeriodId);
      dispatch(setPayslips(payslips));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch payslips'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchPayslip = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payslip = await payrollApi.getPayslip(id);
    dispatch(setSelectedPayslip(payslip));
    return payslip;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch payslip';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const generatePayslips =
  (dto: payrollApi.GeneratePayslipsDto) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const payslips = await payrollApi.generatePayslips(dto);
      dispatch(addPayslips(payslips));
      return payslips;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate payslips';
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const finalizePayslip = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payslip = await payrollApi.finalizePayslip(id);
    dispatch(updatePayslip(payslip));
    return payslip;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to finalize payslip';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const voidPayslip = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const payslip = await payrollApi.voidPayslip(id);
    dispatch(updatePayslip(payslip));
    return payslip;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to void payslip';
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};
