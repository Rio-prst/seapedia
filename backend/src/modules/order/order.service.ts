import prisma from '../../config/prisma';
import {
  findOrdersByBuyerId,
  findOrdersByStoreId,
  findOrderById,
  createOrder,
  createOrderItems,
  createStatusHistory,
  batchUpdateStocks,
} from './order.repository';
import { findCartByBuyerId, deleteAllItems, clearCartStore } from '../cart/cart.repository';
import type { CheckoutInput } from './order.types';
import { DELIVERY_FEES } from './order.types';
import { findWalletByBuyerId } from '../wallet/wallet.repository';
import { findAddressById } from '../address/address.repository';

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

  const discount = 0;
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
      tx,
    );

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
