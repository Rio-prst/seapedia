import prisma from '../../config/prisma';

export const insertReview = async (reviewerName: string, rating: number, comment: string) => {
  return prisma.appReview.create({
    data: { reviewerName, rating, comment },
  });
};

export const getAllReviews = async () => {
  return prisma.appReview.findMany({ orderBy: { createdAt: 'desc' } });
};