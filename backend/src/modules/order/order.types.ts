import { z } from 'zod';

const deliveryMethodEnum = z.enum(['instant', 'next_day', 'regular']);

export const checkoutSchema = z.object({
  deliveryMethod: deliveryMethodEnum,
  addressId: z.number(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type DeliveryMethod = 'instant' | 'next_day' | 'regular';

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  instant: 25000,
  next_day: 15000,
  regular: 8000,
};
