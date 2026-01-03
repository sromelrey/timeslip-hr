import api from './api';

export interface PayPeriod {
  id: number;
  companyId: number;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED';
  closedAt?: string | null;
  closedByUserId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payslip {
  id: number;
  employeeId: number;
  payPeriodId: number;
  status: 'DRAFT' | 'FINALIZED' | 'VOID';
  currency?: string | null;
  totalRegularMinutes: number;
  totalOvertimeMinutes: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  generatedByUserId?: number | null;
  generatedAt?: string | null;
  finalizedAt?: string | null;
  voidedAt?: string | null;
  voidedByUserId?: number | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
  };
  payPeriod?: PayPeriod;
  items?: PayslipItem[];
}

export interface PayslipItem {
  id: number;
  payslipId: number;
  type: 'EARNING' | 'DEDUCTION';
  code: string;
  label: string;
  amount: number;
  metaJson?: string | null;
  createdAt: string;
}

export interface CreatePayPeriodDto {
  startDate: string;
  endDate: string;
}

export interface GeneratePayslipsDto {
  payPeriodId: number;
  employeeIds?: number[];
}

// Pay Period API
export const getPayPeriods = async (): Promise<PayPeriod[]> => {
  const response = await api.get('/payroll/pay-periods');
  return response.data;
};

export const createPayPeriod = async (
  dto: CreatePayPeriodDto
): Promise<PayPeriod> => {
  const response = await api.post('/payroll/pay-periods', dto);
  return response.data;
};

export const closePayPeriod = async (id: number): Promise<PayPeriod> => {
  const response = await api.patch(`/payroll/pay-periods/${id}/close`, {});
  return response.data;
};

export const reopenPayPeriod = async (id: number): Promise<PayPeriod> => {
  const response = await api.patch(`/payroll/pay-periods/${id}/reopen`, {});
  return response.data;
};

// Payslip API
export const getPayslips = async (
  payPeriodId?: number
): Promise<Payslip[]> => {
  const params = payPeriodId ? { payPeriodId } : {};
  const response = await api.get('/payroll/payslips', { params });
  return response.data;
};

export const getPayslip = async (id: number): Promise<Payslip> => {
  const response = await api.get(`/payroll/payslips/${id}`);
  return response.data;
};

export const generatePayslips = async (
  dto: GeneratePayslipsDto
): Promise<Payslip[]> => {
  const response = await api.post('/payroll/payslips/generate', dto);
  return response.data;
};

export const finalizePayslip = async (id: number): Promise<Payslip> => {
  const response = await api.patch(`/payroll/payslips/${id}/finalize`, {});
  return response.data;
};

export const voidPayslip = async (id: number): Promise<Payslip> => {
  const response = await api.patch(`/payroll/payslips/${id}/void`, {});
  return response.data;
};

export const downloadPayslipPdf = async (id: number): Promise<Blob> => {
  const response = await api.get(`/payroll/payslips/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportPayslipsZip = async (payPeriodId: number): Promise<Blob> => {
  const response = await api.get(`/payroll/pay-periods/${payPeriodId}/export-zip`, {
    responseType: 'blob',
  });
  return response.data;
};
