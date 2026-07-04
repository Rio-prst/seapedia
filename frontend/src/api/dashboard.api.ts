import api from './client';
import type { DashboardStats } from '../types';

export const getStats = () =>
  api.get<{ stats: DashboardStats }>('/dashboard/stats').then((r) => r.data);
