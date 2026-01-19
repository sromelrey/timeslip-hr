import { useEffect } from 'react';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useDashboardRefresh(refetchFn: () => void) {
  useEffect(() => {
    const interval = setInterval(() => {
      refetchFn();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refetchFn]);
}
