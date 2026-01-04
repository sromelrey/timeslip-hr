import { configureStore } from '@reduxjs/toolkit';
import authReducer from './global/slices/auth-slice';
import productReducer from './core/slices/product-slice';
import employeeReducer from './core/slices/employee-slice';
import timesheetReducer from './core/slices/timesheet-slice';
import timeEventReducer from './core/slices/time-event-slice';
import payrollReducer from './core/payroll-slice';
import deductionReducer from './core/slices/deduction-slice';
import dashboardReducer from './core/slices/dashboard-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    employee: employeeReducer,
    timesheet: timesheetReducer,
    timeEvent: timeEventReducer,
    payroll: payrollReducer,
    deduction: deductionReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
