import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '@/store/core/thunks/super-admin-thunks';
import { CreateCompanyDto } from '@/lib/super-admin.api';

export function useCompanyManagement() {
  const dispatch = useAppDispatch();
  const { companies, loading, error } = useAppSelector((state) => state.superAdmin);

  const loadCompanies = useCallback(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleCreateCompany = async (dto: CreateCompanyDto) => {
    return dispatch(createCompany(dto)).unwrap();
  };

  const handleUpdateCompany = async (id: number, dto: Partial<CreateCompanyDto>) => {
    return dispatch(updateCompany({ id, dto })).unwrap();
  };

  const handleDeleteCompany = async (id: number) => {
    return dispatch(deleteCompany(id)).unwrap();
  };

  return {
    companies,
    loading,
    error,
    loadCompanies,
    createCompany: handleCreateCompany,
    updateCompany: handleUpdateCompany,
    deleteCompany: handleDeleteCompany,
  };
}
