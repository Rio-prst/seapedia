import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { create, update, me, show } from './stores.controller';

const router = Router();

router.get('/me', authenticate, requireRole('seller'), me);
router.get('/:id', show);
router.post('/', authenticate, requireRole('seller'), create);
router.put('/:id', authenticate, requireRole('seller'), update);

export default router;
