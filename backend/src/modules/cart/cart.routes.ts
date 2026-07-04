import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { show, addItem, updateItem, removeItem } from './cart.controller';

const router = Router();
router.use(authenticate, requireRole('buyer'));
router.get('/', show);
router.post('/items', addItem);
router.put('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);

export default router;
