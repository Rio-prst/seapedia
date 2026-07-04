import prisma from '../../config/prisma';

export const findAddressesByBuyerId = (buyerId: number) =>
  prisma.address.findMany({
    where: { buyerId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

export const findAddressById = (id: number) =>
  prisma.address.findUnique({ where: { id } });

export const createAddress = (buyerId: number, data: {
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) =>
  prisma.address.create({
    data: { ...data, buyerId },
  });

export const updateAddress = (id: number, data: {
  label?: string;
  recipientName?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isDefault?: boolean;
}) =>
  prisma.address.update({ where: { id }, data });

export const deleteAddress = (id: number) =>
  prisma.address.delete({ where: { id } });

export const resetDefaultAddress = (buyerId: number) =>
  prisma.address.updateMany({
    where: { buyerId, isDefault: true },
    data: { isDefault: false },
  });
