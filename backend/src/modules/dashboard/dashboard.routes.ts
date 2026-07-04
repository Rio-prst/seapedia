import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { stats } from './dashboard.controller';

const router = Router();

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics based on active role
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats (varies by role)
 */
router.get('/stats', authenticate, stats);

export default router;
