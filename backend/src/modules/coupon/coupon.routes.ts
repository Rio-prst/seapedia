import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, create, destroy } from './coupon.controller';

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: List seller's coupons
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/', requireRole('seller'), index);

/**
 * @openapi
 * /coupons:
 *   post:
 *     tags: [Coupons]
 *     summary: Create a coupon (seller)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, type, value, maxUsage]
 *             properties:
 *               code:      { type: string }
 *               type:      { type: string, enum: [percent, nominal] }
 *               value:     { type: number }
 *               minPurchase: { type: number }
 *               maxUsage:  { type: integer }
 *               expiresAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Coupon created
 *       400:
 *         description: Validation error
 */
router.post('/', requireRole('seller'), create);

/**
 * @openapi
 * /coupons/{id}:
 *   delete:
 *     tags: [Coupons]
 *     summary: Delete a coupon
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Coupon deleted
 */
router.delete('/:id', requireRole('seller'), destroy);

export default router;
