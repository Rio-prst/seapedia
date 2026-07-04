import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['percent', 'nominal']),
  value: z.number().positive(),
  minPurchase: z.number().min(0).optional(),
  maxUsage: z.number().int().min(0).default(0),
  expiresAt: z.string().datetime().optional(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
