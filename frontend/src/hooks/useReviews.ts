import { useState, useEffect, useCallback } from 'react';
import * as reviewsApi from '../api/reviews.api';
import type { Review } from '../types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reviewsApi.getReviews();
      setReviews(data.reviews);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = useCallback(async (name: string, rating: number, comment: string) => {
    await reviewsApi.createReview(name, rating, comment);
    await fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, fetchReviews, submitReview };
}
