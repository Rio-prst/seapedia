import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { queue, assign, mine, detail, updateStatus } from './delivery.controller';

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /deliveries/queue:
 *   get:
 *     tags: [Deliveries]
 *     summary: List available delivery jobs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of available jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/queue', requireRole('driver'), queue);

/**
 * @openapi
 * /deliveries/{id}/assign:
 *   post:
 *     tags: [Deliveries]
 *     summary: Take a delivery job
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Job assigned
 *       400:
 *         description: Already taken or invalid
 */
router.post('/:id/assign', requireRole('driver'), assign);

/**
 * @openapi
 * /deliveries/mine:
 *   get:
 *     tags: [Deliveries]
 *     summary: Get my deliveries
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Driver's deliveries
 */
router.get('/mine', requireRole('driver'), mine);

/**
 * @openapi
 * /deliveries/{id}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Get delivery detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Delivery detail
 */
router.get('/:id', requireRole('driver'), detail);

/**
 * @openapi
 * /deliveries/{id}/status:
 *   patch:
 *     tags: [Deliveries]
 *     summary: Update delivery status
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
 *               status: { type: string, enum: [sedang_dikirim, pesanan_selesai] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', requireRole('driver'), updateStatus);

export default router;
