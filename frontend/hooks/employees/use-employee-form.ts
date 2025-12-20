import { useState, useCallback } from 'react';
import { CreateEmployeeDto, EmploymentType } from '@/store/core/thunks/employee-thunks';

// Define the shape of the form data (all strings for inputs)
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  isActive: boolean;
  hiredAt: string;
  rate: string; // Keep as string for input, convert to number for DTO
}

const initialFormData: EmployeeFormData = {
  firstName: '',
  lastName: '',
  department: '',
  position: '',
  employmentType: 'SALARIED', // Default
  isActive: true,
  hiredAt: new Date().toISOString().split('T')[0], // Today
  rate: '',
};

export function useEmployeeForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckedChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setShowForm(false);
  }, []);

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
  }, []);

  const getFormattedData = useCallback((): CreateEmployeeDto => {
    return {
      companyId: 1, // Hardcoded for now, should come from auth/context
      firstName: formData.firstName,
      lastName: formData.lastName,
      department: formData.department || undefined,
      position: formData.position || undefined,
      employmentType: formData.employmentType as any,
      isActive: formData.isActive,
      hiredAt: formData.hiredAt,
      rate: formData.rate ? parseFloat(formData.rate) : undefined,
    };
  }, [formData]);

  const setFormFromEntity = useCallback((employee: any) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      department: employee.department || '',
      position: employee.position || '',
      employmentType: employee.employmentType,
      isActive: employee.isActive,
      hiredAt: employee.hiredAt ? employee.hiredAt.split('T')[0] : '',
      rate: '', // Reset rate on edit as we don't fetch it with employee list yet
    });
    setShowForm(true);
  }, []);

  return {
    showForm,
    formData,
    handleChange,
    handleSelectChange,
    handleCheckedChange,
    resetForm,
    toggleForm,
    getFormattedData,
    setFormFromEntity,
  };
}
