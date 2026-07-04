import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import * as storesApi from '../../api/stores.api';
import type { Store } from '../../types';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    storesApi
      .getStoreById(Number(id))
      .then((res) => setStore(res.store))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/" className="text-sm text-teal-600 hover:underline">
          &larr; Back to catalog
        </Link>

        {loading ? (
          <p className="mt-6 text-slate-500">Loading...</p>
        ) : !store ? (
          <p className="mt-6 text-slate-500">Store not found.</p>
        ) : (
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-slate-800">{store.name}</h1>
            {store.description && (
              <p className="mt-2 text-sm text-slate-500">{store.description}</p>
            )}
            {store.seller && (
              <p className="mt-1 text-xs text-slate-400">Seller: {store.seller.username}</p>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
