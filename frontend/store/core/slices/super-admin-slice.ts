import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalStats, Company } from '@/lib/super-admin.api';
import { 
  fetchGlobalStats, 
  fetchCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '../thunks/super-admin-thunks';

interface SuperAdminState {
  stats: GlobalStats | null;
  companies: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  stats: null,
  companies: [],
  loading: false,
  error: null,
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchGlobalStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalStats.fulfilled, (state, action: PayloadAction<GlobalStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchGlobalStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Company
      .addCase(createCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.companies.unshift(action.payload);
        if (state.stats) {
          state.stats.totalCompanies += 1;
        }
      })
      // Update Company
      .addCase(updateCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      // Delete Company
      .addCase(deleteCompany.fulfilled, (state, action: PayloadAction<number>) => {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
        if (state.stats) {
          state.stats.totalCompanies -= 1;
        }
      });
  },
});

export const { clearError } = superAdminSlice.actions;
export default superAdminSlice.reducer;
