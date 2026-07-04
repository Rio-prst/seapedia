import api from './client';
import type { AuthResponse, User, Role } from '../types';

export const register = (username: string, email: string, password: string) =>
  api.post('/auth/register', { username, email, password }).then((r) => r.data);

export const login = (email: string, password: string): Promise<AuthResponse> =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const refreshTokens = (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> =>
  api.post('/auth/refresh', { refreshToken }).then((r) => r.data);

export const logout = (refreshToken: string): Promise<void> =>
  api.post('/auth/logout', { refreshToken }).then((r) => r.data);

export const getMe = (): Promise<User> =>
  api.get('/users/me').then((r) => r.data);

export const getRoles = (): Promise<Role[]> =>
  api.get('/users/roles').then((r) => r.data.roles);

export const setActiveRole = (role: Role): Promise<{ token: string; activeRole: Role }> =>
  api.post('/users/active-role', { role }).then((r) => r.data);
