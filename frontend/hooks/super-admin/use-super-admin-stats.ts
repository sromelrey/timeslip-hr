import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGlobalStats } from '@/store/core/thunks/super-admin-thunks';

export function useSuperAdminStats() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.superAdmin);

  const loadStats = useCallback(() => {
    dispatch(fetchGlobalStats());
  }, [dispatch]);

  return {
    stats,
    loading,
    error,
    loadStats,
  };
}
