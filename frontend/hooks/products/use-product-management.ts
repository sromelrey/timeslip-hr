import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/store/core/thunks/product-thunks';
import { clearError } from '@/store/core/slices/product-slice';

interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
}

interface UpdateProductDto {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export function useProductManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreateProduct = useCallback(
    async (dto: CreateProductDto) => {
      return dispatch(createProduct(dto)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateProduct = useCallback(
    async (id: number, dto: UpdateProductDto) => {
      return dispatch(updateProduct({ id, dto })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      return dispatch(deleteProduct(id)).unwrap();
    },
    [dispatch]
  );

  const deleteWithConfirmation = useCallback(
    async (id: number) => {
      if (confirm('Are you sure you want to delete this product?')) {
        return handleDeleteProduct(id);
      }
    },
    [handleDeleteProduct]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    products,
    isLoading: loading,
    error,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    deleteWithConfirmation,
    clearError: handleClearError,
    refetch: () => dispatch(fetchProducts()),
  };
}
