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

export const saveRefreshToken = (userId: number, tokenHash: string, expiresAt: Date) => {
  return prisma.refreshToken.create({
    data: { userId, token: tokenHash, expiresAt },
  });
};

export const findRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.findUnique({ where: { token: tokenHash } });
};

export const deleteRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.deleteMany({ where: { token: tokenHash } });
};

export const deleteExpiredRefreshTokens = () => {
  return prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
};
