import { Request, Response } from 'express';
import { registerSchema, loginSchema, refreshSchema } from './auth.types';
import { registerUser, loginUser, refreshUserToken, logoutUser } from './auth.service';

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const user = await registerUser(parsed.data);
    res.status(201).json({ user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(400).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const result = await loginUser(parsed.data);
    res.json(result);
  } catch (err: unknown) {
    res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid credentials' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const result = await refreshUserToken(parsed.data.refreshToken);
    res.json(result);
  } catch (err: unknown) {
    res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  res.json({ message: 'Logged out successfully' });
};
