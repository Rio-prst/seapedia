import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, create } from './productReview.controller';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /products/{productId}/reviews:
 *   get:
 *     tags: [Product Reviews]
 *     summary: List reviews for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of product reviews
 */
router.get('/', index);

/**
 * @openapi
 * /products/{productId}/reviews:
 *   post:
 *     tags: [Product Reviews]
 *     summary: Submit a product review (buyer only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:  { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, requireRole('buyer'), create);

export default router;
