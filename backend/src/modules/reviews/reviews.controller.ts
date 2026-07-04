import { Request, Response } from 'express';
import { createReviewSchema } from './reviews.types';
import { insertReview, getAllReviews } from './reviews.repository';

export const createReview = async (req: Request, res: Response) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const review = await insertReview(parsed.data.reviewer_name, parsed.data.rating, parsed.data.comment);
  res.status(201).json({ review });
};

export const listReviews = async (_req: Request, res: Response) => {
  const reviews = await getAllReviews();
  res.json({ reviews });
};