import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/core/thunks/dashboard-thunks';

export function useDashboardStats() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchDashboardStats());
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
