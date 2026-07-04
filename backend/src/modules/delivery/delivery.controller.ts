import { Request, Response } from 'express';
import { updateDeliveryStatusSchema } from './delivery.types';
import {
  getQueue,
  takeJob,
  updateDriverDeliveryStatus,
  getMyDeliveries,
  getDeliveryDetail,
} from './delivery.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const queue = async (_req: Request, res: Response) => {
  try {
    const jobs = await getQueue();
    res.json({ jobs });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const assign = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const order = await takeJob(Number(req.params.id), userId);
    res.json({ order });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const mine = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const deliveries = await getMyDeliveries(userId);
    res.json({ deliveries });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const detail = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const delivery = await getDeliveryDetail(Number(req.params.id), userId);
    res.json({ delivery });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const parsed = updateDeliveryStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const order = await updateDriverDeliveryStatus(Number(req.params.id), userId, parsed.data.status);
    res.json({ order });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};


