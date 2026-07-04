import { Request, Response } from 'express';
import { createAddressSchema, updateAddressSchema } from './address.types';
import { listAddresses, createBuyerAddress, updateBuyerAddress, deleteBuyerAddress } from './address.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const index = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const addresses = await listAddresses(userId);
    res.json({ addresses });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = createAddressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const address = await createBuyerAddress(userId, parsed.data);
    res.status(201).json({ address });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = updateAddressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const address = await updateBuyerAddress(userId, Number(req.params.id), parsed.data);
    res.json({ address });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const remove = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    await deleteBuyerAddress(userId, Number(req.params.id));
    res.json({ message: 'Address deleted' });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
