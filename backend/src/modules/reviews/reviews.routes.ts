import { Router } from 'express';
import { createReview, listReviews } from './reviews.controller';

const router = Router();
router.post('/', createReview);
router.get('/', listReviews);

export default router;