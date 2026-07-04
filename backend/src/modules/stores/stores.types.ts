import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const updateStoreSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
