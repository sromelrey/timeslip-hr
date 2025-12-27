import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { loginUser, logoutUser, fetchCurrentUser } from '@/store/global/thunks/auth-thunks';
import { restoreAuth, clearAuth, clearError } from '@/store/global/slices/auth-slice';
import { getAccessToken, getRefreshToken, clearTokens } from '@/lib/api';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, refreshToken, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Restore auth from localStorage on mount
  useEffect(() => {
    const storedAccessToken = getAccessToken();
    const storedRefreshToken = getRefreshToken();

    if (storedAccessToken && storedRefreshToken && !isAuthenticated) {
      // Verify token by fetching current user
      dispatch(fetchCurrentUser())
        .unwrap()
        .then((data) => {
          dispatch(
            restoreAuth({
              user: data.user,
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            })
          );
        })
        .catch(() => {
          // Token invalid, clear storage
          clearTokens();
          dispatch(clearAuth());
        });
    } else if ((!storedAccessToken || !storedRefreshToken) && !isAuthenticated) {
      // If no tokens in storage, strictly clear cookies to prevent middleware mismatch
      // This handles the "Ghost Admin" case where cookies persist but LS is empty
      clearTokens();
    }
  }, [dispatch, isAuthenticated]);

  // Ensure cookies are always synced with user state
  useEffect(() => {
    if (isAuthenticated && user?.role && typeof window !== 'undefined') {
      // Sync cookies to ensure middleware sees the same state as client
      document.cookie = `timeslip_role=${user.role}; path=/; max-age=31536000`;
      document.cookie = `timeslip_auth=1; path=/; max-age=31536000`;
    }
  }, [isAuthenticated, user?.role]);

  const login = useCallback(
    async (email: string, password: string) => {
      return dispatch(loginUser({ email, password })).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading: loading,
    error,
    login,
    logout,
    clearError: handleClearError,
  };
}
