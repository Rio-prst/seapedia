import { Request, Response } from 'express';
import { getSellerStats, getBuyerStats, getDriverStats, getAdminStats } from './dashboard.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const stats = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const activeRole = req.user?.activeRole;

  try {
    if (activeRole === 'seller') {
      const data = await getSellerStats(userId);
      return res.json({ stats: data ?? { storeName: null, productCount: 0, orderCount: 0, revenue: 0 } });
    }
    if (activeRole === 'buyer') {
      const data = await getBuyerStats(userId);
      return res.json({ stats: data });
    }
    if (activeRole === 'driver') {
      const data = await getDriverStats(userId);
      return res.json({ stats: data });
    }
    if (activeRole === 'admin') {
      const data = await getAdminStats();
      return res.json({ stats: data });
    }
    res.json({ stats: null });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
