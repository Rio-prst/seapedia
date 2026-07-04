import prisma from '../../config/prisma';
import type { OrderStatus, Prisma, DeliveryMethod } from '@prisma/client';





const orderInclude = {
  store: { select: { id: true, name: true } },
  address: {
    select: {
      id: true,
      label: true,
      recipientName: true,
      phone: true,
      street: true,
      city: true,
      province: true,
      postalCode: true,
    },
  },
  coupon: { select: { id: true, code: true, category: true, type: true, value: true } },
  items: {
    include: {
      product: { select: { id: true, name: true } },
    },
  },
  driver: { select: { id: true, username: true } },
  statusHistory: { orderBy: { createdAt: 'asc' as const } },
} as const;

export const findOrdersByBuyerId = (buyerId: number) =>
  prisma.order.findMany({
    where: { buyerId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findOrdersByStoreId = (storeId: number) =>
  prisma.order.findMany({
    where: { storeId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findOrderById = (id: number) =>
  prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

export const createOrder = (
  buyerId: number,
  storeId: number,
  addressId: number,
  deliveryMethod: DeliveryMethod,
  deliveryFee: number,
  subtotal: number,
  discount: number,
  ppn: number,
  total: number,
  couponId?: number | null,
  deliveryDeadline?: Date | null,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.order.create({
    data: {
      buyerId,
      storeId,
      addressId,
      deliveryMethod,
      deliveryFee,
      subtotal,
      discount,
      ppn,
      total,
      couponId,
      deliveryDeadline,
      status: 'sedang_dikemas',
    },
    include: orderInclude,
  });
};

export const createOrderItems = (
  orderId: number,
  items: { productId: number; quantity: number; price: number }[],
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.orderItem.createMany({
    data: items.map((item) => ({ orderId, ...item })),
  });
};

export const createStatusHistory = (
  orderId: number,
  status: OrderStatus,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.orderStatusHistory.create({
    data: { orderId, status },
  });
};

export const batchUpdateStocks = (
  items: { productId: number; quantity: number }[],
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  const values = items.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
  const flatArgs = items.flatMap((item) => [item.productId, item.quantity]);
  return client.$executeRawUnsafe(
    `UPDATE products SET stock = stock - t.quantity FROM (VALUES ${values}) AS t(id, quantity) WHERE products.id = t.id`,
    ...flatArgs,
  );
};

export const updateOrderStatusFn = (
  orderId: number,
  status: OrderStatus,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.order.update({
    where: { id: orderId },
    data: { status },
    include: orderInclude,
  });
};
