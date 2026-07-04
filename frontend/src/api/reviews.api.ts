import api from './client';
import type { Review } from '../types';

export const getReviews = () =>
  api.get<{ reviews: Review[] }>('/reviews').then((r) => r.data);

export const createReview = (reviewerName: string, rating: number, comment: string) =>
  api.post<{ review: Review }>('/reviews', { reviewer_name: reviewerName, rating, comment }).then((r) => r.data);
