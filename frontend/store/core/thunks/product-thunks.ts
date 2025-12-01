import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
}

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

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (dto: CreateProductDto, { rejectWithValue }) => {
    try {
      const response = await api.post<Product>('/products', dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, dto }: { id: number; dto: UpdateProductDto }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Product>(`/products/${id}`, dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);
