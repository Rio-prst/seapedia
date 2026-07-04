import api from './client';
import type { ProductReview, ReviewInput } from '../types';

export const getProductReviews = (productId: number) =>
  api.get<{ reviews: ProductReview[] }>(`/products/${productId}/reviews`).then((r) => r.data);

export const createProductReview = (productId: number, data: ReviewInput) =>
  api.post<{ review: ProductReview }>(`/products/${productId}/reviews`, data).then((r) => r.data);
