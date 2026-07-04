import api from './client';
import type { Cart } from '../types';

export const getCart = () =>
  api.get<{ cart: Cart }>('/cart').then((r) => r.data);

export const addCartItem = (productId: number, quantity: number) =>
  api.post<{ cart: Cart }>('/cart/items', { productId, quantity }).then((r) => r.data);

export const updateCartItem = (productId: number, quantity: number) =>
  api.put<{ cart: Cart }>(`/cart/items/${productId}`, { quantity }).then((r) => r.data);

export const removeCartItem = (productId: number) =>
  api.delete<{ cart: Cart }>(`/cart/items/${productId}`).then((r) => r.data);
