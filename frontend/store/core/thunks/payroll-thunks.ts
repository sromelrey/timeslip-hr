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
    const token = localStorage.getItem('token') || '';
    const payPeriods = await payrollApi.getPayPeriods(token);
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
      const token = localStorage.getItem('token') || '';
      const payPeriod = await payrollApi.createPayPeriod(token, dto);
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
    const token = localStorage.getItem('token') || '';
    const payPeriod = await payrollApi.closePayPeriod(token, id);
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
    const token = localStorage.getItem('token') || '';
    const payPeriod = await payrollApi.reopenPayPeriod(token, id);
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
      const token = localStorage.getItem('token') || '';
      const payslips = await payrollApi.getPayslips(token, payPeriodId);
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
    const token = localStorage.getItem('token') || '';
    const payslip = await payrollApi.getPayslip(token, id);
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
      const token = localStorage.getItem('token') || '';
      const payslips = await payrollApi.generatePayslips(token, dto);
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
    const token = localStorage.getItem('token') || '';
    const payslip = await payrollApi.finalizePayslip(token, id);
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
    const token = localStorage.getItem('token') || '';
    const payslip = await payrollApi.voidPayslip(token, id);
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
