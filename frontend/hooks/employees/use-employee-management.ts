import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@/store/core/thunks/employee-thunks';
import { clearError } from '@/store/core/slices/employee-slice';

export function useEmployeeManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employee);

  // Fetch employees on mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleCreateEmployee = useCallback(
    async (dto: CreateEmployeeDto) => {
      return dispatch(createEmployee(dto)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateEmployee = useCallback(
    async (id: number, dto: UpdateEmployeeDto) => {
      return dispatch(updateEmployee({ id, dto })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteEmployee = useCallback(
    async (id: number) => {
      return dispatch(deleteEmployee(id)).unwrap();
    },
    [dispatch]
  );

  const deleteWithConfirmation = useCallback(
    async (id: number) => {
      if (confirm('Are you sure you want to delete this employee?')) {
        return handleDeleteEmployee(id);
      }
    },
    [handleDeleteEmployee]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    employees,
    isLoading: loading,
    error,
    createEmployee: handleCreateEmployee,
    updateEmployee: handleUpdateEmployee,
    deleteEmployee: handleDeleteEmployee,
    deleteWithConfirmation,
    clearError: handleClearError,
    refetch: () => dispatch(fetchEmployees()),
  };
}
