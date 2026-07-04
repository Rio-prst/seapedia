import { useState, useEffect } from 'react';
import * as productsApi from '../api/products.api';
import type { Product } from '../types';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Failed to load products';
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productsApi
      .getProducts()
      .then((res) => setProducts(res.products))
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
