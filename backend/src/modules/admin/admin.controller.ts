import { Request, Response } from 'express';
import { createCouponSchema, simulateTimeSchema } from './admin.types';
import {
  getStats,
  listUsers,
  listProducts,
  listOrders,
  listCoupons,
  createCouponCode,
  removeCoupon,
  processOverdue,
  simulateTime,
} from './admin.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const stats = async (_req: Request, res: Response) => {
  try {
    const data = await getStats();
    res.json({ stats: data });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const users = async (_req: Request, res: Response) => {
  try {
    const data = await listUsers();
    res.json({ users: data });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const products = async (_req: Request, res: Response) => {
  try {
    const data = await listProducts();
    res.json({ products: data });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const orders = async (_req: Request, res: Response) => {
  try {
    const data = await listOrders();
    res.json({ orders: data });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const coupons = async (_req: Request, res: Response) => {
  try {
    const data = await listCoupons();
    res.json({ coupons: data });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const createCouponHandler = async (req: Request, res: Response) => {
  const parsed = createCouponSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const coupon = await createCouponCode(parsed.data);
    res.status(201).json({ coupon });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const deleteCouponHandler = async (req: Request, res: Response) => {
  try {
    const result = await removeCoupon(Number(req.params.id));
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const runProcessOverdue = async (_req: Request, res: Response) => {
  try {
    const result = await processOverdue();
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const runSimulateTime = async (req: Request, res: Response) => {
  const parsed = simulateTimeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const result = await simulateTime(parsed.data.hours);
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
