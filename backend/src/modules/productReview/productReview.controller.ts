import { Request, Response } from 'express';
import { createReviewSchema } from './productReview.types';
import { listProductReviews, createProductReview } from './productReview.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const index = async (req: Request, res: Response) => {
  try {
    const reviews = await listProductReviews(Number(req.params.productId));
    res.json({ reviews });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const review = await createProductReview(Number(req.params.productId), userId, parsed.data);
    res.status(201).json({ review });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
