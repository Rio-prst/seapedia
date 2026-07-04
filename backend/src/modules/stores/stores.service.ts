import { findStoreBySellerId, findStoreByName, createStore, updateStore, findStoreById } from './stores.repository';
import type { CreateStoreInput, UpdateStoreInput } from './stores.types';

export const getMyStore = async (sellerId: number) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('Store not found');
  return store;
};

export const getStoreById = async (id: number) => {
  const store = await findStoreById(id);
  if (!store) throw new Error('Store not found');
  return store;
};

export const createSellerStore = async (sellerId: number, input: CreateStoreInput) => {
  const existing = await findStoreBySellerId(sellerId);
  if (existing) throw new Error('You already have a store');

  const nameTaken = await findStoreByName(input.name);
  if (nameTaken) throw new Error('Store name is already taken');

  return createStore(sellerId, input.name, input.description);
};

export const updateSellerStore = async (sellerId: number, input: UpdateStoreInput) => {
  const store = await findStoreBySellerId(sellerId);
  if (!store) throw new Error('Store not found');

  if (input.name && input.name !== store.name) {
    const nameTaken = await findStoreByName(input.name);
    if (nameTaken) throw new Error('Store name is already taken');
  }

  return updateStore(store.id, input);
};
