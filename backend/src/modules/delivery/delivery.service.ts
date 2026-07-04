import prisma from '../../config/prisma';
import {
  findAvailableJobs,
  findDriverDeliveries,
  findDeliveryById,
  assignDriver,
  updateDeliveryStatus,
  createDeliveryStatusHistory,
} from './delivery.repository';
import { isValidTransition } from '../order/order.types';
import type { OrderStatus } from '@prisma/client';

export const getQueue = async () => findAvailableJobs();

export const takeJob = async (orderId: number, driverId: number) => {
  const order = await findDeliveryById(orderId);
  if (!order) throw new Error('Delivery not found');
  if (order.status !== 'menunggu_pengirim') throw new Error('This order is not ready for delivery');
  if (order.driverId) throw new Error('This order already has a driver assigned');

  const updated = await prisma.$transaction(async (tx) => {
    await assignDriver(orderId, driverId, tx);
    await createDeliveryStatusHistory(orderId, 'sedang_dikirim', tx);
    return updateDeliveryStatus(orderId, 'sedang_dikirim', tx);
  });

  return updated;
};

export const updateDriverDeliveryStatus = async (
  orderId: number,
  driverId: number,
  newStatus: string,
) => {
  const order = await findDeliveryById(orderId);
  if (!order) throw new Error('Delivery not found');
  if (order.driverId !== driverId) throw new Error('This delivery is not assigned to you');

  if (!isValidTransition(order.status, newStatus)) {
    throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await createDeliveryStatusHistory(orderId, newStatus as OrderStatus, tx);
    return updateDeliveryStatus(orderId, newStatus as OrderStatus, tx);
  });

  return updated;
};

export const getMyDeliveries = async (driverId: number) =>
  findDriverDeliveries(driverId);

export const getDeliveryDetail = async (orderId: number, driverId: number) => {
  const order = await findDeliveryById(orderId);
  if (!order) throw new Error('Delivery not found');
  if (order.driverId !== driverId) throw new Error('This delivery is not assigned to you');
  return order;
};


