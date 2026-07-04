import { z } from 'zod';

export const createReviewSchema = z.object({
  reviewer_name: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});