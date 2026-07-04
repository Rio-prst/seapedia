import type { CreateProductInput, UpdateProductInput } from './products.types';
import {
  findAllProducts,
  findProductById,
  findProductsByStoreId,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products.repository';
import { findStoreBySellerId } from '../stores/stores.repository';

export const listProducts = async () => findAllProducts();

export const getProductById = async (id: number) => {
  const product = await findProductById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

export const listMyProducts = async (sellerId: number) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('You must create a store first');
  return findProductsByStoreId(store.id);
};

export const createSellerProduct = async (sellerId: number, input: CreateProductInput) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('You must create a store first');

  return createProduct(store.id, input);
};

export const updateSellerProduct = async (sellerId: number, productId: number, input: UpdateProductInput) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('Store not found');

  const product = await findProductById(productId);
  if (!product) throw new Error('Product not found');
  if (product.storeId !== store.id) throw new Error('You can only update your own products');

  return updateProduct(productId, input);
};

export const deleteSellerProduct = async (sellerId: number, productId: number) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('Store not found');

  const product = await findProductById(productId);
  if (!product) throw new Error('Product not found');
  if (product.storeId !== store.id) throw new Error('You can only delete your own products');

  return deleteProduct(productId);
};
