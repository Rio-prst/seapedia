import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import {
  stats,
  users,
  products,
  orders,
  coupons,
  createCouponHandler,
  deleteCouponHandler,
  runProcessOverdue,
  runSimulateTime,
} from './admin.controller';

const router = Router();
router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get marketplace overview stats
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Stats for users, stores, products, orders, coupons
 */
router.get('/stats', stats);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of users with their roles
 */
router.get('/users', users);

/**
 * @openapi
 * /admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: List all products
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/products', products);

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: List all orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all orders with store, buyer, driver info
 */
router.get('/orders', orders);

/**
 * @openapi
 * /admin/coupons:
 *   get:
 *     tags: [Admin]
 *     summary: List all coupons
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all coupons
 */
router.get('/coupons', coupons);

/**
 * @openapi
 * /admin/coupons:
 *   post:
 *     tags: [Admin]
 *     summary: Create a coupon (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, category, type, value, maxUsage]
 *             properties:
 *               code:        { type: string }
 *               category:    { type: string, enum: [voucher, promo] }
 *               type:        { type: string, enum: [percent, nominal] }
 *               value:       { type: number }
 *               minPurchase: { type: number }
 *               maxUsage:    { type: integer }
 *               expiresAt:   { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Coupon created
 */
router.post('/coupons', createCouponHandler);

/**
 * @openapi
 * /admin/coupons/{id}:
 *   delete:
 *     tags: [Admin]
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
router.delete('/coupons/:id', deleteCouponHandler);

/**
 * @openapi
 * /admin/process-overdue:
 *   post:
 *     tags: [Admin]
 *     summary: Process overdue orders (auto refund)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Overdue orders processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 processed: { type: integer }
 *                 message: { type: string }
 */
router.post('/process-overdue', runProcessOverdue);

/**
 * @openapi
 * /admin/simulate-time:
 *   post:
 *     tags: [Admin]
 *     summary: Simulate +1 day advance
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Time simulated
 */
router.post('/simulate-time', runSimulateTime);

export default router;
