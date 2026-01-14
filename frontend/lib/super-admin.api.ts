import api from './api';

export interface GlobalStats {
  totalCompanies: number;
  totalUsers: number;
  totalEmployees: number;
}

export interface Company {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
}

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const response = await api.get('/super-admin/stats');
  return response.data;
};

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/super-admin/companies');
  return response.data;
};

export const createCompany = async (dto: CreateCompanyDto): Promise<Company> => {
  const response = await api.post('/super-admin/companies', dto);
  return response.data;
};

export const updateCompany = async (id: number, dto: Partial<CreateCompanyDto>): Promise<Company> => {
  const response = await api.patch(`/super-admin/companies/${id}`, dto);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/super-admin/companies/${id}`);
};

export interface CreateCompanyAdminDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export const createCompanyAdmin = async (companyId: number, dto: CreateCompanyAdminDto): Promise<unknown> => {
  const response = await api.post(`/super-admin/companies/${companyId}/admins`, dto);
  return response.data;
};
