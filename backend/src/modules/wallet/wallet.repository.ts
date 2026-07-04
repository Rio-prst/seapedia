import prisma from '../../config/prisma';

export const findWalletByBuyerId = (buyerId: number) =>
  prisma.wallet.findUnique({
    where: { buyerId },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  });

export const createWallet = (buyerId: number) =>
  prisma.wallet.create({
    data: { buyerId },
    include: { transactions: true },
  });

export const incrementBalance = (buyerId: number, amount: number) =>
  prisma.wallet.update({
    where: { buyerId },
    data: { balance: { increment: amount } },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  });

export const decrementBalance = (buyerId: number, amount: number) =>
  prisma.wallet.update({
    where: { buyerId },
    data: { balance: { decrement: amount } },
  });

export const createTransaction = (
  walletId: number,
  type: 'topup' | 'payment' | 'refund',
  amount: number,
  description: string,
) =>
  prisma.walletTransaction.create({
    data: { walletId, type, amount, description },
  });
