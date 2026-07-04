import prisma from '../../config/prisma';
import type { OrderStatus, Prisma } from '@prisma/client';

const deliveryInclude = {
  store: { select: { id: true, name: true } },
  buyer: { select: { id: true, username: true } },
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
  items: {
    include: {
      product: { select: { id: true, name: true } },
    },
  },
  statusHistory: { orderBy: { createdAt: 'asc' as const } },
};

export const findAvailableJobs = () =>
  prisma.order.findMany({
    where: {
      status: 'menunggu_pengirim',
      driverId: null,
    },
    include: deliveryInclude,
    orderBy: { createdAt: 'asc' },
  });

export const findDriverDeliveries = (driverId: number) =>
  prisma.order.findMany({
    where: { driverId },
    include: deliveryInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findDeliveryById = (id: number) =>
  prisma.order.findUnique({
    where: { id },
    include: deliveryInclude,
  });

export const assignDriver = (
  orderId: number,
  driverId: number,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.order.update({
    where: { id: orderId },
    data: { driverId },
  });
};

export const updateDeliveryStatus = (
  orderId: number,
  status: OrderStatus,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.order.update({
    where: { id: orderId },
    data: { status },
    include: deliveryInclude,
  });
};

export const createDeliveryStatusHistory = (
  orderId: number,
  status: OrderStatus,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return client.orderStatusHistory.create({
    data: { orderId, status },
  });
};
