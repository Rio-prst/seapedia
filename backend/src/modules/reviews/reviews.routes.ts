import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { createReview, listReviews } from './reviews.controller';

const router = Router();

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit an application review
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reviewer_name, rating, comment]
 *             properties:
 *               reviewer_name: { type: string, maxLength: 100 }
 *               rating:        { type: integer, minimum: 1, maximum: 5 }
 *               comment:       { type: string, maxLength: 1000 }
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, createReview);

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List all application reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       reviewerName: { type: string }
 *                       rating: { type: integer }
 *                       comment: { type: string }
 *                       createdAt: { type: string, format: date-time }
 */
router.get('/', listReviews);

export default router;
