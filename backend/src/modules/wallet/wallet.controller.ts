import { Request, Response } from 'express';
import { topupSchema } from './wallet.types';
import { getWallet, topupWallet } from './wallet.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const wallet = await getWallet(userId);
    res.json({ wallet });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const topup = async (req: Request, res: Response) => {
  const parsed = topupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const wallet = await topupWallet(userId, parsed.data);
    res.json({ wallet });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
