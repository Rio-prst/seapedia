import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { show, addItem, updateItem, removeItem } from './cart.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));

/**
 * @openapi
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cart with items
 */
router.get('/', show);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add product to cart (single-store rule enforced)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: integer }
 *               quantity:  { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Item added
 *       400:
 *         description: Different store conflict or validation error
 */
router.post('/items', addItem);

/**
 * @openapi
 * /cart/items/{productId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update item quantity
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
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Quantity updated
 */
router.put('/items/:productId', updateItem);

/**
 * @openapi
 * /cart/items/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/items/:productId', removeItem);

export default router;
