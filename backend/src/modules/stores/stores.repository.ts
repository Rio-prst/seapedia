import prisma from '../../config/prisma';

export const findStoreById = (id: number) =>
  prisma.store.findUnique({
    where: { id },
    include: { seller: { select: { id: true, username: true } } },
  });

export const findStoreBySellerId = (sellerId: number) =>
  prisma.store.findUnique({
    where: { sellerId },
    include: { seller: { select: { id: true, username: true } } },
  });

export const findStoreByName = (name: string) =>
  prisma.store.findUnique({ where: { name } });

export const createStore = (sellerId: number, name: string, description?: string) =>
  prisma.store.create({
    data: { sellerId, name, description },
    include: { seller: { select: { id: true, username: true } } },
  });

export const updateStore = (id: number, data: { name?: string; description?: string }) =>
  prisma.store.update({
    where: { id },
    data,
    include: { seller: { select: { id: true, username: true } } },
  });
