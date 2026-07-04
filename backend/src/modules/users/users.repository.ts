import prisma from '../../config/prisma';
import { Role } from '@prisma/client';

export const getRolesByUserId = async (userId: number) => {
  const rows = await prisma.userRole.findMany({ where: { userId }, select: { role: true } });
  return rows.map(r => r.role);
};

export const roleExistsForUser = async (userId: number, role: Role): Promise<boolean> => {
  const found = await prisma.userRole.findUnique({
    where: { userId_role: { userId, role } },
  });
  return !!found;
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true },
  });
};