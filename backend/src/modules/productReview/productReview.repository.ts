import prisma from '../../config/prisma';

const reviewInclude = {
  buyer: { select: { id: true, username: true } },
} as const;

export const findReviewsByProductId = (productId: number) =>
  prisma.productReview.findMany({
    where: { productId },
    include: reviewInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findReviewByProductAndBuyer = (productId: number, buyerId: number) =>
  prisma.productReview.findUnique({
    where: { productId_buyerId: { productId, buyerId } },
  });

export const createReview = (productId: number, buyerId: number, data: { rating: number; comment: string }) =>
  prisma.productReview.create({
    data: { productId, buyerId, ...data },
    include: reviewInclude,
  });
