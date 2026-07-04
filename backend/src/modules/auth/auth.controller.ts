import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.types';
import { registerUser, loginUser } from './auth.service';

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const user = await registerUser(parsed.data);
    res.status(201).json({ user });
  } catch (err: any) {
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
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ message: 'Logged out. Please discard your token client-side.' });
};