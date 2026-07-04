import prisma from '../../config/prisma';

const couponInclude = {
  _count: { select: { orders: true } },
} as const;

export const findCouponsByStoreId = (storeId: number) =>
  prisma.coupon.findMany({
    where: { storeId },
    include: couponInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findCouponByCode = (code: string) =>
  prisma.coupon.findUnique({ where: { code } });

export const findCouponById = (id: number) =>
  prisma.coupon.findUnique({ where: { id }, include: couponInclude });

export const createCoupon = (storeId: number, data: {
  code: string;
  type: 'percent' | 'nominal';
  value: number;
  minPurchase?: number;
  maxUsage: number;
  expiresAt?: Date;
}) =>
  prisma.coupon.create({
    data: { ...data, storeId },
    include: couponInclude,
  });

export const incrementCouponUsage = (id: number, tx?: any) => {
  const client = tx ?? prisma;
  return client.coupon.update({
    where: { id },
    data: { usageCount: { increment: 1 } },
  });
};

export const deleteCoupon = (id: number) =>
  prisma.coupon.delete({ where: { id } });
