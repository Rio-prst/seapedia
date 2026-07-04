import {
  findWalletByBuyerId,
  createWallet,
  incrementBalance,
  createTransaction,
} from './wallet.repository';
import type { TopupInput } from './wallet.types';

export const getWallet = async (buyerId: number) => {
  let wallet = await findWalletByBuyerId(buyerId);
  if (!wallet) {
    wallet = await createWallet(buyerId);
  }
  return wallet;
};

export const topupWallet = async (buyerId: number, input: TopupInput) => {
  let wallet = await findWalletByBuyerId(buyerId);
  if (!wallet) {
    wallet = await createWallet(buyerId);
  }

  await createTransaction(wallet.id, 'topup', input.amount, 'Top up balance');
  wallet = await incrementBalance(buyerId, input.amount);

  return wallet;
};
