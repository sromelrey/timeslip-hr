import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Deduction } from '@/lib/deduction.api';

interface DeductionState {
  deductions: Deduction[];
  selectedDeduction: Deduction | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeductionState = {
  deductions: [],
  selectedDeduction: null,
  loading: false,
  error: null,
};

const deductionSlice = createSlice({
  name: 'deduction',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDeductions: (state, action: PayloadAction<Deduction[]>) => {
      state.deductions = action.payload;
      state.error = null;
    },
    addDeduction: (state, action: PayloadAction<Deduction>) => {
      state.deductions.push(action.payload);
      state.error = null;
    },
    updateDeduction: (state, action: PayloadAction<Deduction>) => {
      const index = state.deductions.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.deductions[index] = action.payload;
      }
      state.error = null;
    },
    removeDeduction: (state, action: PayloadAction<number>) => {
      state.deductions = state.deductions.filter((d) => d.id !== action.payload);
      state.error = null;
    },
    setSelectedDeduction: (state, action: PayloadAction<Deduction | null>) => {
      state.selectedDeduction = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setDeductions,
  addDeduction,
  updateDeduction,
  removeDeduction,
  setSelectedDeduction,
} = deductionSlice.actions;

export default deductionSlice.reducer;
