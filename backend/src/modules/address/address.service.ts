import {
  findAddressesByBuyerId,
  findAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  resetDefaultAddress,
} from './address.repository';
import type { CreateAddressInput, UpdateAddressInput } from './address.types';

export const listAddresses = async (buyerId: number) =>
  findAddressesByBuyerId(buyerId);

export const createBuyerAddress = async (buyerId: number, input: CreateAddressInput) => {
  if (input.isDefault) {
    await resetDefaultAddress(buyerId);
  }
  return createAddress(buyerId, input);
};

export const updateBuyerAddress = async (buyerId: number, addressId: number, input: UpdateAddressInput) => {
  const address = await findAddressById(addressId);
  if (!address) throw new Error('Address not found');
  if (address.buyerId !== buyerId) throw new Error('You can only update your own addresses');

  if (input.isDefault) {
    await resetDefaultAddress(buyerId);
  }

  return updateAddress(addressId, input);
};

export const deleteBuyerAddress = async (buyerId: number, addressId: number) => {
  const address = await findAddressById(addressId);
  if (!address) throw new Error('Address not found');
  if (address.buyerId !== buyerId) throw new Error('You can only delete your own addresses');

  return deleteAddress(addressId);
};
