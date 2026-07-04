import { z } from 'zod';

const deliveryMethodEnum = z.enum(['instant', 'next_day', 'regular']);

export const checkoutSchema = z.object({
  deliveryMethod: deliveryMethodEnum,
  addressId: z.number(),
  couponCode: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['menunggu_pengirim', 'sedang_dikirim', 'pesanan_selesai', 'dikembalikan']),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type DeliveryMethod = 'instant' | 'next_day' | 'regular';

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  instant: 25000,
  next_day: 15000,
  regular: 8000,
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  sedang_dikemas: ['menunggu_pengirim', 'dikembalikan'],
  menunggu_pengirim: ['sedang_dikirim', 'dikembalikan'],
  sedang_dikirim: ['pesanan_selesai', 'dikembalikan'],
  pesanan_selesai: ['dikembalikan'],
  dikembalikan: [],
};

export function isValidTransition(from: string, to: string): boolean {
  const allowed = STATUS_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}
