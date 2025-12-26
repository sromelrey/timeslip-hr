import { configureStore } from '@reduxjs/toolkit';
import authReducer from './global/slices/auth-slice';
import productReducer from './core/slices/product-slice';
import employeeReducer from './core/slices/employee-slice';
import timesheetReducer from './core/slices/timesheet-slice';
import timeEventReducer from './core/slices/time-event-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    employee: employeeReducer,
    timesheet: timesheetReducer,
    timeEvent: timeEventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
