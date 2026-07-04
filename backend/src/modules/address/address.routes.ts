import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { index, create, update, remove } from './address.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));
router.get('/', index);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
