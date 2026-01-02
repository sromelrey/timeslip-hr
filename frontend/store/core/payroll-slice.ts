import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PayPeriod, Payslip } from '../../lib/payroll.api';

export interface PayrollState {
  payPeriods: PayPeriod[];
  payslips: Payslip[];
  selectedPayPeriod: PayPeriod | null;
  selectedPayslip: Payslip | null;
  loading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
  payPeriods: [],
  payslips: [],
  selectedPayPeriod: null,
  selectedPayslip: null,
  loading: false,
  error: null,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPayPeriods: (state, action: PayloadAction<PayPeriod[]>) => {
      state.payPeriods = action.payload;
      state.error = null;
    },
    addPayPeriod: (state, action: PayloadAction<PayPeriod>) => {
      state.payPeriods.unshift(action.payload);
      state.error = null;
    },
    updatePayPeriod: (state, action: PayloadAction<PayPeriod>) => {
      const index = state.payPeriods.findIndex(
        (pp: PayPeriod) => pp.id === action.payload.id
      );
      if (index !== -1) {
        state.payPeriods[index] = action.payload;
      }
      state.error = null;
    },
    setPayslips: (state, action: PayloadAction<Payslip[]>) => {
      state.payslips = action.payload;
      state.error = null;
    },
    addPayslips: (state, action: PayloadAction<Payslip[]>) => {
      state.payslips = [...action.payload, ...state.payslips];
      state.error = null;
    },
    updatePayslip: (state, action: PayloadAction<Payslip>) => {
      const index = state.payslips.findIndex(
        (ps: Payslip) => ps.id === action.payload.id
      );
      if (index !== -1) {
        state.payslips[index] = action.payload;
      }
      state.error = null;
    },
    setSelectedPayPeriod: (state, action: PayloadAction<PayPeriod | null>) => {
      state.selectedPayPeriod = action.payload;
    },
    setSelectedPayslip: (state, action: PayloadAction<Payslip | null>) => {
      state.selectedPayslip = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPayPeriods,
  addPayPeriod,
  updatePayPeriod,
  setPayslips,
  addPayslips,
  updatePayslip,
  setSelectedPayPeriod,
  setSelectedPayslip,
  clearError,
} = payrollSlice.actions;

export default payrollSlice.reducer;
