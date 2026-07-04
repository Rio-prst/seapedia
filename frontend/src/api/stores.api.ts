import api from './client';
import type { Store } from '../types';

export const getMyStore = () =>
  api.get<{ store: Store }>('/stores/me').then((r) => r.data);

export const getStoreById = (id: number) =>
  api.get<{ store: Store }>(`/stores/${id}`).then((r) => r.data);

export const createStore = (data: { name: string; description?: string }) =>
  api.post<{ store: Store }>('/stores', data).then((r) => r.data);

export const updateStore = (id: number, data: { name?: string; description?: string }) =>
  api.put<{ store: Store }>(`/stores/${id}`, data).then((r) => r.data);
