import { useState, useEffect } from 'react';
import { Input, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import * as storesApi from '../../api/stores.api';
import type { Store } from '../../types';

export default function SellerStore() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    storesApi
      .getMyStore()
      .then((res) => {
        setStore(res.store);
        setName(res.store.name);
        setDescription(res.store.description || '');
      })
      .catch(() => setStore(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (store) {
        const res = await storesApi.updateStore(store.id, { name, description });
        setStore(res.store);
        setSuccess('Store updated successfully');
      } else {
        const res = await storesApi.createStore({ name, description });
        setStore(res.store);
        setSuccess('Store created successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">
        {store ? 'My Store' : 'Create Your Store'}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {store
          ? 'Update your store information'
          : 'Set up your store to start selling products'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <Input
          label="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-teal-600">{success}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
        </Button>
      </form>
    </div>
  );
}
