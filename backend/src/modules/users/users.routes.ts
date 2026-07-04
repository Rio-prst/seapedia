import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { getMyRoles, setActiveRole, getMyProfile } from './users.controller';

const router = Router();

/**
 * @openapi
 * /users/roles:
 *   get:
 *     tags: [Users]
 *     summary: Get list of roles owned by the current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [admin, seller, buyer, driver]
 */
router.get('/roles', authenticate, getMyRoles);

/**
 * @openapi
 * /users/active-role:
 *   post:
 *     tags: [Users]
 *     summary: Set the active role for the current session
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, seller, buyer, driver]
 *     responses:
 *       200:
 *         description: Returns a new token scoped to the selected role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 activeRole: { type: string }
 *       403:
 *         description: You do not own this role
 */
router.post('/active-role', authenticate, setActiveRole);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get the current user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile including roles and active role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 username: { type: string }
 *                 email: { type: string }
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [admin, seller, buyer, driver]
 *                 activeRole: { type: string, nullable: true }
 */
router.get('/me', authenticate, getMyProfile);

export default router;
