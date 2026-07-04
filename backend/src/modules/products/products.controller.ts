import { Request, Response } from 'express';
import { createProductSchema, updateProductSchema } from './products.types';
import {
  listProducts,
  getProductById,
  listMyProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from './products.service';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export const index = async (_req: Request, res: Response) => {
  try {
    const products = await listProducts();
    res.json({ products });
  } catch (err: unknown) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(Number(req.params.id));
    res.json({ product });
  } catch (err: unknown) {
    res.status(404).json({ error: getErrorMessage(err) });
  }
};

export const myProducts = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const products = await listMyProducts(userId);
    res.json({ products });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const product = await createSellerProduct(userId, parsed.data);
    res.status(201).json({ product });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const product = await updateSellerProduct(userId, Number(req.params.id), parsed.data);
    res.json({ product });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const remove = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    await deleteSellerProduct(userId, Number(req.params.id));
    res.json({ message: 'Product deleted' });
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};
