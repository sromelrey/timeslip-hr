import { useState, useCallback } from 'react';

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price: string;
  stock: string;
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  description: '',
  price: '',
  stock: '',
};

export function useProductForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setShowForm(false);
  }, []);

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
  }, []);

  const getFormattedData = useCallback(() => {
    return {
      name: formData.name,
      sku: formData.sku,
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
    };
  }, [formData]);

  return {
    showForm,
    formData,
    handleChange,
    resetForm,
    toggleForm,
    getFormattedData,
  };
}
