import prisma from '../../config/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUserWithDefaultRole = async (
  username: string,
  email: string,
  passwordHash: string
) => {
  return prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      roles: { create: { role: 'buyer' } },
    },
    select: { id: true, username: true, email: true },
  });
};