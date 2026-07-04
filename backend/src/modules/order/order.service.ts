import prisma from '../../config/prisma';
import {
  findOrdersByBuyerId,
  findOrdersByStoreId,
  findOrderById,
  createOrder,
  createOrderItems,
  createStatusHistory,
  batchUpdateStocks,
  updateOrderStatusFn,
} from './order.repository';
import { findCartByBuyerId, deleteAllItems, clearCartStore } from '../cart/cart.repository';
import { findCouponByCode, incrementCouponUsage } from '../coupon/coupon.repository';
import { findAddressById } from '../address/address.repository';
import type { CheckoutInput } from './order.types';
import { DELIVERY_FEES, isValidTransition } from './order.types';
import type { OrderStatus } from '@prisma/client';

export const listBuyerOrders = async (buyerId: number) =>
  findOrdersByBuyerId(buyerId);

export const getOrderDetail = async (orderId: number, userId: number) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.buyerId !== userId) throw new Error('You can only view your own orders');
  return order;
};

export const listIncomingOrders = async (storeId: number) => {
  if (!storeId) throw new Error('Store not found');
  return findOrdersByStoreId(storeId);
};

export const checkout = async (buyerId: number, input: CheckoutInput) => {
  const cart = await findCartByBuyerId(buyerId);
  if (!cart) throw new Error('Cart not found');
  if (!cart.storeId) throw new Error('Cart is empty');
  if (cart.items.length === 0) throw new Error('Cart is empty');

  const deliveryMethod = input.deliveryMethod;
  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  if (!deliveryFee) throw new Error('Invalid delivery method');

  let subtotal = 0;
  for (const item of cart.items) {
    const price = Number(item.product.price);
    if (item.quantity > item.product.stock) {
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
    subtotal += price * item.quantity;
  }

  let discount = 0;
  let couponId: number | null = null;

  if (input.couponCode) {
    const coupon = await findCouponByCode(input.couponCode);
    if (!coupon) throw new Error('Coupon not found');
    if (coupon.storeId !== cart.storeId) throw new Error('Coupon does not apply to this store');
    if (coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage) throw new Error('Coupon usage limit reached');
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error('Coupon has expired');
    if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
      throw new Error(`Minimum purchase of Rp ${Number(coupon.minPurchase).toLocaleString()} required`);
    }

    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * Number(coupon.value) / 100);
    } else {
      discount = Number(coupon.value);
      if (discount > subtotal) discount = subtotal;
    }
    couponId = coupon.id;
  }

  const taxable = subtotal - discount;
  const ppn = Math.round(taxable * 0.12);
  const total = taxable + ppn + deliveryFee;

  const wallet = await prisma.wallet.findUnique({ where: { buyerId } });
  if (!wallet) throw new Error('Wallet not found');
  if (Number(wallet.balance) < total) throw new Error('Insufficient wallet balance');

  const address = await findAddressById(input.addressId);
  if (!address) throw new Error('Address not found');
  if (address.buyerId !== buyerId) throw new Error('Address does not belong to you');

  const storeId = cart.storeId;
  if (!storeId) throw new Error('Cart has no store');

  const newOrder = await prisma.$transaction(async (tx) => {
    const now = new Date();
    let deadline: Date | null = null;
    if (deliveryMethod === 'instant') {
      deadline = new Date(now.getTime() + 24 * 3600000);
    } else if (deliveryMethod === 'next_day') {
      deadline = new Date(now.getTime() + 48 * 3600000);
    } else if (deliveryMethod === 'regular') {
      deadline = new Date(now.getTime() + 120 * 3600000);
    }

    const order = await createOrder(
      buyerId,
      storeId,
      address.id,
      deliveryMethod,
      deliveryFee,
      subtotal,
      discount,
      ppn,
      total,
      couponId,
      deadline,
      tx,
    );

    if (couponId) {
      await incrementCouponUsage(couponId, tx);
    }

    await createOrderItems(
      order.id,
      cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
      })),
      tx,
    );

    await createStatusHistory(order.id, 'sedang_dikemas', tx);

    await batchUpdateStocks(
      cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      tx,
    );

    await tx.wallet.update({
      where: { buyerId },
      data: { balance: { decrement: total } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'payment',
        amount: total,
        description: `Payment for order #${order.id}`,
      },
    });

    return order;
  }, { timeout: 15000 });

  await deleteAllItems(cart.id);
  await clearCartStore(buyerId);

  return newOrder;
};

export const updateOrderStatus = async (orderId: number, storeId: number, newStatus: string) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.storeId !== storeId) throw new Error('Order does not belong to your store');

  if (!isValidTransition(order.status, newStatus)) {
    throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await createStatusHistory(orderId, newStatus as OrderStatus, tx);
    return updateOrderStatusFn(orderId, newStatus as OrderStatus, tx);
  });

  return updated;
};
