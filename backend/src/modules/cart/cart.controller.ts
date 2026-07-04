import { Request, Response } from 'express';
import { addCartItemSchema, updateCartItemSchema } from './cart.types';
import { getCart, addCartItem, updateCartItem, removeCartItem } from './cart.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const show = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const cart = await getCart(userId);
    res.json({ cart });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const addItem = async (req: Request, res: Response) => {
  const parsed = addCartItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const cart = await addCartItem(userId, parsed.data);
    res.json({ cart });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const parsed = updateCartItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const cart = await updateCartItem(userId, Number(req.params.productId), parsed.data);
    res.json({ cart });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const cart = await removeCartItem(userId, Number(req.params.productId));
    res.json({ cart });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
