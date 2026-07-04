import api from './client';
import type { Order, DeliveryMethod } from '../types';

export const getMyOrders = () =>
  api.get<{ orders: Order[] }>('/orders/my').then((r) => r.data);

export const getOrderDetail = (id: number) =>
  api.get<{ order: Order }>(`/orders/${id}`).then((r) => r.data);

export const getIncomingOrders = () =>
  api.get<{ orders: Order[] }>('/orders/incoming').then((r) => r.data);

export const checkout = (deliveryMethod: DeliveryMethod, addressId: number, couponCode?: string) =>
  api.post<{ order: Order }>('/orders/checkout', { deliveryMethod, addressId, couponCode }).then((r) => r.data);

export const updateOrderStatus = (id: number, status: string) =>
  api.patch<{ order: Order }>(`/orders/${id}/status`, { status }).then((r) => r.data);
