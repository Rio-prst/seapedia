import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { myOrders, detail, incomingOrders, createCheckout, updateStatus } from './order.controller';

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /orders/incoming:
 *   get:
 *     tags: [Orders]
 *     summary: Get incoming orders for seller
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of incoming orders
 */
router.get('/incoming', requireRole('seller'), incomingOrders);

/**
 * @openapi
 * /orders/my:
 *   get:
 *     tags: [Orders]
 *     summary: Get buyer's order history
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of buyer's orders
 */
router.get('/my', requireRole('buyer'), myOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order detail by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Order detail with items, history, coupon, driver
 *       404:
 *         description: Order not found
 */
router.get('/:id', detail);

/**
 * @openapi
 * /orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order (checkout)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [storeId, addressId, deliveryMethod]
 *             properties:
 *               storeId:        { type: integer }
 *               addressId:      { type: integer }
 *               deliveryMethod: { type: string, enum: [instant, next_day, regular] }
 *               couponCode:     { type: string }
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Insufficient balance, stock, or validation error
 */
router.post('/checkout', requireRole('buyer'), createCheckout);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (seller processing)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, description: "Next valid status" }
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid transition
 */
router.patch('/:id/status', requireRole('seller'), updateStatus);

export default router;
