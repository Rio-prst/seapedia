import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, show, myProducts, create, update, remove } from './products.controller';

const router = Router();

router.get('/', index);
router.get('/me/list', authenticate, requireRole('seller'), myProducts);
router.get('/:id', show);
router.post('/', authenticate, requireRole('seller'), create);
router.put('/:id', authenticate, requireRole('seller'), update);
router.delete('/:id', authenticate, requireRole('seller'), remove);

export default router;
