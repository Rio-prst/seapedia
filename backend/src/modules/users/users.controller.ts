import { Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { getRolesByUserId, roleExistsForUser, getUserById } from './users.repository';
import { signAccessToken } from '../../utils/jwt';

function getUserId(req: Request, res: Response): number | null {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  return userId;
}

export const getMyRoles = async (req: Request, res: Response) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const roles = await getRolesByUserId(userId);
  res.json({ roles });
};

const activeRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const setActiveRole = async (req: Request, res: Response) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const parsed = activeRoleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const owns = await roleExistsForUser(userId, parsed.data.role);
  if (!owns) return res.status(403).json({ error: 'You do not own this role' });

  const token = signAccessToken({
    userId,
    activeRole: parsed.data.role,
  });

  res.json({ token, activeRole: parsed.data.role });
};

export const getMyProfile = async (req: Request, res: Response) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const user = await getUserById(userId);
  const roles = await getRolesByUserId(userId);
  res.json({ ...user, roles, activeRole: req.user?.activeRole ?? null });
};