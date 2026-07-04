import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { me, topup } from './wallet.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));

/**
 * @openapi
 * /wallet/me:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet balance and transaction history
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Wallet data with transactions
 */
router.get('/me', me);

/**
 * @openapi
 * /wallet/topup:
 *   post:
 *     tags: [Wallet]
 *     summary: Dummy top-up
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, minimum: 1 }
 *     responses:
 *       200:
 *         description: Top-up successful
 *       400:
 *         description: Validation error
 */
router.post('/topup', topup);

export default router;
