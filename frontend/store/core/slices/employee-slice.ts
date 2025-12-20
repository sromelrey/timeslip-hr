import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchEmployees, 
  fetchEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  Employee 
} from '../thunks/employee-thunks';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single employee
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload;
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
      })
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
      });
  },
});

export const { clearError, clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
