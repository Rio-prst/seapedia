import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, create, update, remove } from './address.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));

/**
 * @openapi
 * /addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: List buyer's addresses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of addresses
 */
router.get('/', index);

/**
 * @openapi
 * /addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Create a new address
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label, recipientName, phone, street, city, province, postalCode]
 *             properties:
 *               label:         { type: string }
 *               recipientName: { type: string }
 *               phone:         { type: string }
 *               street:        { type: string }
 *               city:          { type: string }
 *               province:      { type: string }
 *               postalCode:    { type: string }
 *               isDefault:     { type: boolean }
 *     responses:
 *       201:
 *         description: Address created
 *       400:
 *         description: Validation error
 */
router.post('/', create);

/**
 * @openapi
 * /addresses/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update an address
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
 *               label:         { type: string }
 *               recipientName: { type: string }
 *               phone:         { type: string }
 *               street:        { type: string }
 *               city:          { type: string }
 *               province:      { type: string }
 *               postalCode:    { type: string }
 *               isDefault:     { type: boolean }
 *     responses:
 *       200:
 *         description: Address updated
 *       404:
 *         description: Address not found
 */
router.put('/:id', update);

/**
 * @openapi
 * /addresses/{id}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete an address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */
router.delete('/:id', remove);

export default router;
