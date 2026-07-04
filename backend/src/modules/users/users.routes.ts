import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { getMyRoles, setActiveRole, getMyProfile } from './users.controller';

const router = Router();
router.get('/roles', authenticate, getMyRoles);
router.post('/active-role', authenticate, setActiveRole);
router.get('/me', authenticate, getMyProfile);

export default router;