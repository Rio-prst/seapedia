import api from './client';
import type { Coupon } from '../types';

export const getCoupons = () =>
  api.get<{ coupons: Coupon[] }>('/coupons').then((r) => r.data);

export const createCoupon = (data: {
  code: string;
  type: 'percent' | 'nominal';
  value: number;
  minPurchase?: number;
  maxUsage: number;
  expiresAt?: string;
}) =>
  api.post<{ coupon: Coupon }>('/coupons', data).then((r) => r.data);

export const deleteCoupon = (id: number) =>
  api.delete<{ message: string }>(`/coupons/${id}`).then((r) => r.data);
