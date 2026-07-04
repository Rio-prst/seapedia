import {
  findCartByBuyerId,
  createCart,
  updateCartStore,
  addItem,
  findCartItem,
  updateItemQuantity,
  deleteItem,
  deleteAllItems,
  clearCartStore,
} from './cart.repository';
import { findProductById } from '../products/products.repository';
import type { AddCartItemInput, UpdateCartItemInput } from './cart.types';

export const getCart = async (buyerId: number) => {
  let cart = await findCartByBuyerId(buyerId);
  if (!cart) {
    cart = await createCart(buyerId, null);
  }
  return cart;
};

export const addCartItem = async (buyerId: number, input: AddCartItemInput) => {
  const product = await findProductById(input.productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < input.quantity) throw new Error('Insufficient stock');

  let cart = await findCartByBuyerId(buyerId);

  if (!cart || cart.items.length === 0) {
    if (!cart) {
      cart = await createCart(buyerId, product.storeId);
    } else {
      cart = await updateCartStore(buyerId, product.storeId);
    }
  } else {
    if (cart.storeId !== product.storeId) {
      throw new Error(
        'Your cart already contains products from another store. Please clear your cart first to add products from a different store.',
      );
    }
  }

  const existingItem = await findCartItem(cart.id, input.productId);
  if (existingItem) {
    const newQty = existingItem.quantity + input.quantity;
    if (newQty > product.stock) throw new Error('Insufficient stock');
    await updateItemQuantity(cart.id, input.productId, newQty);
  } else {
    await addItem(cart.id, input.productId, input.quantity);
  }

  return findCartByBuyerId(buyerId);
};

export const updateCartItem = async (buyerId: number, productId: number, input: UpdateCartItemInput) => {
  const cart = await findCartByBuyerId(buyerId);
  if (!cart) throw new Error('Cart not found');

  const item = await findCartItem(cart.id, productId);
  if (!item) throw new Error('Item not found in cart');

  const product = await findProductById(productId);
  if (!product) throw new Error('Product not found');
  if (input.quantity > product.stock) throw new Error('Insufficient stock');

  await updateItemQuantity(cart.id, productId, input.quantity);
  return findCartByBuyerId(buyerId);
};

export const removeCartItem = async (buyerId: number, productId: number) => {
  const cart = await findCartByBuyerId(buyerId);
  if (!cart) throw new Error('Cart not found');

  const item = await findCartItem(cart.id, productId);
  if (!item) throw new Error('Item not found in cart');

  await deleteItem(cart.id, productId);

  const cartWithItems = await findCartByBuyerId(buyerId);
  if (cartWithItems && cartWithItems.items.length === 0) {
    await clearCartStore(buyerId);
  }

  return findCartByBuyerId(buyerId);
};
