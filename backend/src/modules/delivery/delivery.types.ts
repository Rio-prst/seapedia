import { z } from 'zod';

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(['sedang_dikirim', 'pesanan_selesai', 'dikembalikan']),
});

export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
