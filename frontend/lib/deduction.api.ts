import api from './api';

export interface Deduction {
  id: number;
  employeeId: number;
  type: 'TAX' | 'SSS' | 'PHILHEALTH' | 'PAGIBIG' | 'LOAN' | 'OTHER';
  label: string;
  calculationType: 'FIXED' | 'PERCENTAGE';
  amount: number;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    employeeNumber: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateDeductionDto {
  employeeId: number;
  type: 'TAX' | 'SSS' | 'PHILHEALTH' | 'PAGIBIG' | 'LOAN' | 'OTHER';
  label: string;
  calculationType: 'FIXED' | 'PERCENTAGE';
  amount: number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isActive?: boolean;
}

export interface UpdateDeductionDto {
  type?: 'TAX' | 'SSS' | 'PHILHEALTH' | 'PAGIBIG' | 'LOAN' | 'OTHER';
  label?: string;
  calculationType?: 'FIXED' | 'PERCENTAGE';
  amount?: number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isActive?: boolean;
}

// Get all deductions, optionally filtered by employee
export const getDeductions = async (employeeId?: number): Promise<Deduction[]> => {
  const params = employeeId ? { employeeId } : {};
  const response = await api.get('/payroll/deductions', { params });
  return response.data;
};

// Get single deduction
export const getDeduction = async (id: number): Promise<Deduction> => {
  const response = await api.get(`/payroll/deductions/${id}`);
  return response.data;
};

// Create new deduction
export const createDeduction = async (dto: CreateDeductionDto): Promise<Deduction> => {
  const response = await api.post('/payroll/deductions', dto);
  return response.data;
};

// Update existing deduction
export const updateDeduction = async (
  id: number,
  dto: UpdateDeductionDto
): Promise<Deduction> => {
  const response = await api.patch(`/payroll/deductions/${id}`, dto);
  return response.data;
};

// Delete deduction
export const deleteDeduction = async (id: number): Promise<void> => {
  await api.delete(`/payroll/deductions/${id}`);
};
