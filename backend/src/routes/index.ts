import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import reviewsRoutes from '../modules/reviews/reviews.routes';
import storesRoutes from '../modules/stores/stores.routes';
import productsRoutes from '../modules/products/products.routes';
import walletRoutes from '../modules/wallet/wallet.routes';
import addressRoutes from '../modules/address/address.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/order/order.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/stores', storesRoutes);
router.use('/products', productsRoutes);
router.use('/wallet', walletRoutes);
router.use('/addresses', addressRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;