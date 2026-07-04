import api from './client';
import type { Wallet } from '../types';

export const getWallet = () =>
  api.get<{ wallet: Wallet }>('/wallet/me').then((r) => r.data);

export const topup = (amount: number) =>
  api.post<{ wallet: Wallet }>('/wallet/topup', { amount }).then((r) => r.data);
