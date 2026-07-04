import api from './client';
import type { Product, ProductInput } from '../types';

export const getProducts = () =>
  api.get<{ products: Product[] }>('/products').then((r) => r.data);

export const getProductById = (id: number) =>
  api.get<{ product: Product }>(`/products/${id}`).then((r) => r.data);

export const getMyProducts = () =>
  api.get<{ products: Product[] }>('/products/me/list').then((r) => r.data);

export const createProduct = (data: ProductInput) =>
  api.post<{ product: Product }>('/products', data).then((r) => r.data);

export const updateProduct = (id: number, data: Partial<ProductInput>) =>
  api.put<{ product: Product }>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number) =>
  api.delete<{ message: string }>(`/products/${id}`).then((r) => r.data);
