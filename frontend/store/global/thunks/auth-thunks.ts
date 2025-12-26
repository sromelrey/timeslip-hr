import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { setTokens, clearTokens, getRefreshToken } from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  role: string;
  employeeNumber?: number;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens in localStorage and set auth/role cookies
      setTokens(accessToken, refreshToken, user.role);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      clearTokens();
    } catch (error: any) {
      // Clear tokens even if API call fails
      clearTokens();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await api.post<TokensResponse>('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      setTokens(accessToken, newRefreshToken);
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      clearTokens();
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);
