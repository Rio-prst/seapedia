import { Request, Response } from 'express';
import { checkoutSchema, updateStatusSchema } from './order.types';
import { listBuyerOrders, getOrderDetail, listIncomingOrders, checkout, updateOrderStatus } from './order.service';
import { findStoreBySellerId } from '../stores/stores.repository';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const myOrders = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const orders = await listBuyerOrders(userId);
    res.json({ orders });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const detail = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const order = await getOrderDetail(Number(req.params.id), userId);
    res.json({ order });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const incomingOrders = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await findStoreBySellerId(userId);
    if (!store) throw new Error('You must create a store first');
    const orders = await listIncomingOrders(store.id);
    res.json({ orders });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const createCheckout = async (req: Request, res: Response) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const order = await checkout(userId, parsed.data);
    res.status(201).json({ order });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await findStoreBySellerId(userId);
    if (!store) throw new Error('You must create a store first');
    const order = await updateOrderStatus(Number(req.params.id), store.id, parsed.data.status);
    res.json({ order });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
