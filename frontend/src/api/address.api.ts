import api from './client';
import type { Address } from '../types';

export const getAddresses = () =>
  api.get<{ addresses: Address[] }>('/addresses').then((r) => r.data);

export const createAddress = (data: Omit<Address, 'id' | 'buyerId' | 'createdAt'>) =>
  api.post<{ address: Address }>('/addresses', data).then((r) => r.data);

export const updateAddress = (id: number, data: Partial<Omit<Address, 'id' | 'buyerId' | 'createdAt'>>) =>
  api.put<{ address: Address }>(`/addresses/${id}`, data).then((r) => r.data);

export const deleteAddress = (id: number) =>
  api.delete<{ message: string }>(`/addresses/${id}`).then((r) => r.data);
