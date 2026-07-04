import { Request, Response } from 'express';
import { createStoreSchema, updateStoreSchema } from './stores.types';
import { createSellerStore, updateSellerStore, getMyStore, getStoreById } from './stores.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const create = async (req: Request, res: Response) => {
  const parsed = createStoreSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await createSellerStore(userId, parsed.data);
    res.status(201).json({ store });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = updateStoreSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await updateSellerStore(userId, parsed.data);
    res.json({ store });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const store = await getMyStore(userId);
    res.json({ store });
  } catch (err: unknown) {
    res.status(404).json({ error: getErrorMessage(err) });
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const store = await getStoreById(Number(req.params.id));
    res.json({ store });
  } catch (err: unknown) {
    res.status(404).json({ error: getErrorMessage(err) });
  }
};
