import prisma from '../../config/prisma';

const cartInclude = {
  store: { select: { id: true, name: true } },
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

export const findCartByBuyerId = (buyerId: number) =>
  prisma.cart.findUnique({
    where: { buyerId },
    include: cartInclude,
  });

export const createCart = (buyerId: number, storeId: number | null) =>
  prisma.cart.create({
    data: { buyerId, storeId },
    include: cartInclude,
  });

export const updateCartStore = (buyerId: number, storeId: number | null) =>
  prisma.cart.update({
    where: { buyerId },
    data: { storeId },
    include: cartInclude,
  });

export const addItem = (cartId: number, productId: number, quantity: number) =>
  prisma.cartItem.create({
    data: { cartId, productId, quantity },
  });

export const findCartItem = (cartId: number, productId: number) =>
  prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });

export const updateItemQuantity = (cartId: number, productId: number, quantity: number) =>
  prisma.cartItem.update({
    where: { cartId_productId: { cartId, productId } },
    data: { quantity },
  });

export const deleteItem = (cartId: number, productId: number) =>
  prisma.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });

export const deleteAllItems = (cartId: number) =>
  prisma.cartItem.deleteMany({ where: { cartId } });

export const clearCartStore = (buyerId: number) =>
  prisma.cart.update({
    where: { buyerId },
    data: { storeId: null },
    include: { items: true },
  });
