import { Request, Response } from 'express';
import { createCouponSchema } from './coupon.types';
import { listStoreCoupons, createStoreCoupon, removeCoupon } from './coupon.service';
import { findStoreBySellerId } from '../stores/stores.repository';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const index = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await findStoreBySellerId(userId);
    if (!store) throw new Error('You must create a store first');
    const coupons = await listStoreCoupons(store.id);
    res.json({ coupons });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = createCouponSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await findStoreBySellerId(userId);
    if (!store) throw new Error('You must create a store first');
    const coupon = await createStoreCoupon(store.id, {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    });
    res.status(201).json({ coupon });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const destroy = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await findStoreBySellerId(userId);
    if (!store) throw new Error('You must create a store first');
    await removeCoupon(Number(req.params.id), store.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
