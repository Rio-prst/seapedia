import { z } from 'zod';

export const topupSchema = z.object({
  amount: z.number().positive(),
});

export type TopupInput = z.infer<typeof topupSchema>;
