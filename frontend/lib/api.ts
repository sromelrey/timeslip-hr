import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token management functions
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRoleCookie = (role: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `timeslip_role=${role}; path=/; max-age=31536000`; // 1 year
};

export const setTokens = (accessToken: string, refreshToken: string, role?: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Set auth flag cookie for middleware
  document.cookie = 'timeslip_auth=1; path=/';
  // Set role cookie for role-based routing
  if (role) {
    setRoleCookie(role);
  }
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear auth flag cookie
  document.cookie = 'timeslip_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  // Clear role cookie
  document.cookie = 'timeslip_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'; // Clear old cookie
};

// Request interceptor - Add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          setTokens(accessToken, newRefreshToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          // Refresh failed, clear tokens and redirect
          clearTokens();
          if (window.location.pathname !== '/sign-in') {
            window.location.href = '/sign-in';
          }
        }
      } else {
        // No refresh token, redirect to sign-in
        clearTokens();
        if (window.location.pathname !== '/sign-in') {
          window.location.href = '/sign-in';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
