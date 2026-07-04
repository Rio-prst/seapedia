import api from './client';
import type { Order } from '../types';

export const getQueue = () =>
  api.get<{ jobs: Order[] }>('/deliveries/queue').then((r) => r.data);

export const assignDelivery = (id: number) =>
  api.post<{ order: Order }>(`/deliveries/${id}/assign`).then((r) => r.data);

export const getMyDeliveries = () =>
  api.get<{ deliveries: Order[] }>('/deliveries/mine').then((r) => r.data);

export const getDeliveryDetail = (id: number) =>
  api.get<{ delivery: Order }>(`/deliveries/${id}`).then((r) => r.data);

export const updateDeliveryStatus = (id: number, status: string) =>
  api.patch<{ order: Order }>(`/deliveries/${id}/status`, { status }).then((r) => r.data);
