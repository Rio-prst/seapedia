import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.activeRole !== role) {
      return res.status(403).json({ error: `Requires active role: ${role}` });
    }
    next();
  };
};