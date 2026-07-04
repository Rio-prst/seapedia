import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/requireRole';
import { myOrders, detail, incomingOrders, createCheckout } from './order.controller';

const router = Router();
router.use(authenticate);
router.get('/incoming', requireRole('seller'), incomingOrders);
router.get('/my', requireRole('buyer'), myOrders);
router.get('/:id', detail);
router.post('/checkout', requireRole('buyer'), createCheckout);

export default router;
