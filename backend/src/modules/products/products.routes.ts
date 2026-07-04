import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, show, myProducts, create, update, remove } from './products.controller';

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products (public)
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema: { type: integer }
 *         description: Filter by store
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', index);

/**
 * @openapi
 * /products/me/list:
 *   get:
 *     tags: [Products]
 *     summary: List products owned by the logged-in seller
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of seller's products
 */
router.get('/me/list', authenticate, requireRole('seller'), myProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product detail (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product data including store info
 *       404:
 *         description: Product not found
 */
router.get('/:id', show);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *               price:       { type: number, minimum: 0 }
 *               stock:       { type: integer, minimum: 0 }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, requireRole('seller'), create);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
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
 *               price:       { type: number, minimum: 0 }
 *               stock:       { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Not your product
 */
router.put('/:id', authenticate, requireRole('seller'), update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Not your product
 */
router.delete('/:id', authenticate, requireRole('seller'), remove);

export default router;
