import api from './client';
import type { Coupon, CouponInput } from '../types';

export const getAdminStats = () =>
  api.get<{ stats: Record<string, number> }>('/admin/stats').then((r) => r.data);

export const getUsers = () =>
  api.get<{ users: any[] }>('/admin/users').then((r) => r.data);

export const getProducts = () =>
  api.get<{ products: any[] }>('/admin/products').then((r) => r.data);

export const getOrders = () =>
  api.get<{ orders: any[] }>('/admin/orders').then((r) => r.data);

export const getCoupons = () =>
  api.get<{ coupons: Coupon[] }>('/admin/coupons').then((r) => r.data);

export const createCoupon = (data: CouponInput) =>
  api.post<{ coupon: Coupon }>('/admin/coupons', data).then((r) => r.data);

export const deleteCoupon = (id: number) =>
  api.delete<{ message: string }>(`/admin/coupons/${id}`).then((r) => r.data);

export const processOverdue = () =>
  api.post<{ count: number; processed: number[] }>('/admin/process-overdue').then((r) => r.data);

export const simulateTime = (hours: number) =>
  api.post<{ message: string; totalOffset: number }>('/admin/simulate-time', { hours }).then((r) => r.data);
