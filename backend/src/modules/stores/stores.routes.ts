import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { create, update, me, show } from './stores.controller';

const router = Router();

/**
 * @openapi
 * /stores/me:
 *   get:
 *     tags: [Stores]
 *     summary: Get the current seller's store
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Store data
 *       404:
 *         description: No store found
 */
router.get('/me', authenticate, requireRole('seller'), me);

/**
 * @openapi
 * /stores/{id}:
 *   get:
 *     tags: [Stores]
 *     summary: Get a store by ID (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Store data including seller info
 *       404:
 *         description: Store not found
 */
router.get('/:id', show);

/**
 * @openapi
 * /stores:
 *   post:
 *     tags: [Stores]
 *     summary: Create a new store
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Store created
 *       400:
 *         description: Store name already taken or validation error
 */
router.post('/', authenticate, requireRole('seller'), create);

/**
 * @openapi
 * /stores/{id}:
 *   put:
 *     tags: [Stores]
 *     summary: Update store
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
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Store updated
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticate, requireRole('seller'), update);

export default router;
