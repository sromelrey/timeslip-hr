import type { RootState } from '@/store';

export const selectProducts = (state: RootState) => state.product.products;
export const selectSelectedProduct = (state: RootState) => state.product.selectedProduct;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
export const selectProductCount = (state: RootState) => state.product.products.length;
