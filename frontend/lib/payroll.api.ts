import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
export const getPayPeriods = async (token: string): Promise<PayPeriod[]> => {
  const response = await axios.get(`${baseURL}/payroll/pay-periods`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createPayPeriod = async (
  token: string,
  dto: CreatePayPeriodDto
): Promise<PayPeriod> => {
  const response = await axios.post(`${baseURL}/payroll/pay-periods`, dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const closePayPeriod = async (
  token: string,
  id: number
): Promise<PayPeriod> => {
  const response = await axios.patch(
    `${baseURL}/payroll/pay-periods/${id}/close`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const reopenPayPeriod = async (
  token: string,
  id: number
): Promise<PayPeriod> => {
  const response = await axios.patch(
    `${baseURL}/payroll/pay-periods/${id}/reopen`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Payslip API
export const getPayslips = async (
  token: string,
  payPeriodId?: number
): Promise<Payslip[]> => {
  const params = payPeriodId ? { payPeriodId } : {};
  const response = await axios.get(`${baseURL}/payroll/payslips`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPayslip = async (
  token: string,
  id: number
): Promise<Payslip> => {
  const response = await axios.get(`${baseURL}/payroll/payslips/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const generatePayslips = async (
  token: string,
  dto: GeneratePayslipsDto
): Promise<Payslip[]> => {
  const response = await axios.post(
    `${baseURL}/payroll/payslips/generate`,
    dto,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const finalizePayslip = async (
  token: string,
  id: number
): Promise<Payslip> => {
  const response = await axios.patch(
    `${baseURL}/payroll/payslips/${id}/finalize`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const voidPayslip = async (
  token: string,
  id: number
): Promise<Payslip> => {
  const response = await axios.patch(
    `${baseURL}/payroll/payslips/${id}/void`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const downloadPayslipPdf = async (
  token: string,
  id: number
): Promise<Blob> => {
  const response = await axios.get(
    `${baseURL}/payroll/payslips/${id}/pdf`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    }
  );
  return response.data;
};
