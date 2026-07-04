import prisma from '../../config/prisma';
import {
  getSystemStats,
  findAllUsers,
  findAllProducts,
  findAllOrders,
  findAllCoupons,
  createCoupon,
  deleteCoupon,
  findOverdueOrders,
  refundOrder,
  restoreOrderStock,
} from './admin.repository';
import { getNow, addOffset } from '../../utils/timeSimulation';
import type { CreateCouponInput } from './admin.types';

export const getStats = async () => getSystemStats();

export const listUsers = async () => findAllUsers();

export const listProducts = async () => findAllProducts();

export const listOrders = async () => findAllOrders();

export const listCoupons = async () => findAllCoupons();

export const createCouponCode = async (input: CreateCouponInput) => {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw new Error('Coupon code already exists');
  return createCoupon(input);
};

export const removeCoupon = async (id: number) => {
  const coupon = await prisma.coupon.findUnique({ where: { id }, select: { storeId: true } });
  if (!coupon) throw new Error('Coupon not found');
  await deleteCoupon(id);
  return { message: 'Coupon deleted' };
};

export const processOverdue = async () => {
  const now = getNow();
  const overdueOrders = await findOverdueOrders(now);
  const processed: number[] = [];

  for (const order of overdueOrders) {
    await prisma.$transaction(async (tx) => {
      await refundOrder(order.id, tx);

      await tx.orderStatusHistory.create({
        data: { orderId: order.id, status: 'dikembalikan' },
      });

      const wallet = await tx.wallet.findUnique({ where: { buyerId: order.buyerId } });
      if (wallet) {
        await tx.wallet.update({
          where: { buyerId: order.buyerId },
          data: { balance: { increment: Number(order.total) } },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'refund',
            amount: Number(order.total),
            description: `Auto refund for overdue order #${order.id}`,
          },
        });
      }

      if (order.items.length > 0) {
        await restoreOrderStock(
          order.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          tx,
        );
      }
    });

    processed.push(order.id);
  }

  return { processed, count: processed.length };
};

export const simulateTime = async (hours: number) => {
  addOffset(hours * 3600000);
  const totalHours = Math.round(await (async () => {
    const { getOffsetHours } = await import('../../utils/timeSimulation');
    return getOffsetHours();
  })());
  return { message: `Simulated ${hours} hour(s) forward`, totalOffset: totalHours };
};
