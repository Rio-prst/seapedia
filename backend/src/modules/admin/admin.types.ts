import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(1),
  category: z.enum(['voucher', 'promo']),
  type: z.enum(['percent', 'nominal']),
  value: z.number().positive(),
  minPurchase: z.number().min(0).optional(),
  maxUsage: z.number().min(0),
  expiresAt: z.string().optional(),
});

export const simulateTimeSchema = z.object({
  hours: z.number().positive(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type SimulateTimeInput = z.infer<typeof simulateTimeSchema>;
