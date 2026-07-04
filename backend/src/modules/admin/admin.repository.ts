import prisma from '../../config/prisma';
import type { Prisma } from '@prisma/client';

export const getSystemStats = async () => {
  const [
    userCount,
    storeCount,
    productCount,
    orderCount,
    couponCount,
    deliveryCount,
    overdueCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.coupon.count(),
    prisma.order.count({ where: { driverId: { not: null } } }),
    prisma.order.count({
      where: {
        status: { notIn: ['pesanan_selesai', 'dikembalikan'] },
        deliveryDeadline: { not: null, lt: new Date() },
      },
    }),
  ]);

  return { userCount, storeCount, productCount, orderCount, couponCount, deliveryCount, overdueCount };
};

export const findAllUsers = () =>
  prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      roles: { select: { role: true } },
      stores: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const findAllProducts = () =>
  prisma.product.findMany({
    include: {
      store: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const findAllOrders = () =>
  prisma.order.findMany({
    include: {
      store: { select: { id: true, name: true } },
      buyer: { select: { id: true, username: true } },
      driver: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const findAllCoupons = () =>
  prisma.coupon.findMany({
    include: {
      store: { select: { id: true, name: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const createCoupon = (
  data: {
    code: string;
    category: 'voucher' | 'promo';
    type: 'percent' | 'nominal';
    value: number;
    minPurchase?: number;
    maxUsage: number;
    expiresAt?: string;
  },
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.coupon.create({
    data: {
      code: data.code,
      category: data.category,
      type: data.type,
      value: data.value,
      minPurchase: data.minPurchase,
      maxUsage: data.maxUsage,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
};

export const deleteCoupon = (id: number) =>
  prisma.coupon.delete({ where: { id } });

export const findOverdueOrders = (now: Date) =>
  prisma.order.findMany({
    where: {
      status: { notIn: ['pesanan_selesai', 'dikembalikan'] },
      deliveryDeadline: { not: null, lt: now },
    },
    include: {
      buyer: { select: { id: true } },
      items: { select: { productId: true, quantity: true } },
    },
  });

export const refundOrder = (
  orderId: number,
  tx: Prisma.TransactionClient,
) =>
  tx.order.update({
    where: { id: orderId },
    data: { status: 'dikembalikan' },
  });

export const restoreOrderStock = (
  items: { productId: number; quantity: number }[],
  tx: Prisma.TransactionClient,
) => {
  const values = items.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
  const flatArgs = items.flatMap((item) => [item.productId, item.quantity]);
  return tx.$executeRawUnsafe(
    `UPDATE products SET stock = stock + t.quantity FROM (VALUES ${values}) AS t(id, quantity) WHERE products.id = t.id`,
    ...flatArgs,
  );
};
