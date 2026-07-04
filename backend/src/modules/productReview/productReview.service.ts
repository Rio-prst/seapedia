import { findOrdersByBuyerId } from '../order/order.repository';
import { findReviewsByProductId, findReviewByProductAndBuyer, createReview } from './productReview.repository';

export const listProductReviews = async (productId: number) =>
  findReviewsByProductId(productId);

export const createProductReview = async (
  productId: number,
  buyerId: number,
  data: { rating: number; comment: string },
) => {
  const existing = await findReviewByProductAndBuyer(productId, buyerId);
  if (existing) throw new Error('You have already reviewed this product');

  const orders = await findOrdersByBuyerId(buyerId);
  const hasPurchased = orders.some((order) =>
    order.status === 'pesanan_selesai' &&
    order.items.some((item) => item.productId === productId),
  );
  if (!hasPurchased) throw new Error('You can only review products you have purchased and received');

  return createReview(productId, buyerId, data);
};
