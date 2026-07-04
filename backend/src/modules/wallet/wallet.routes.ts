import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { me, topup } from './wallet.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));
router.get('/me', me);
router.post('/topup', topup);

export default router;
