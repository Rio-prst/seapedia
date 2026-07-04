import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as addressApi from '../../api/address.api';
import type { Address } from '../../types';

export default function BuyerAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    label: '', recipientName: '', phone: '', street: '', city: '', province: '', postalCode: '', isDefault: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAddresses = () => {
    addressApi.getAddresses()
      .then((res) => setAddresses(res.addresses))
      .catch(() => setError('Failed to load addresses'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAddresses, []);

  const resetForm = () => {
    setForm({ label: '', recipientName: '', phone: '', street: '', city: '', province: '', postalCode: '', isDefault: false });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (addr: Address) => {
    setForm({
      label: addr.label, recipientName: addr.recipientName, phone: addr.phone,
      street: addr.street, city: addr.city, province: addr.province,
      postalCode: addr.postalCode, isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        await addressApi.updateAddress(editingId, form);
      } else {
        await addressApi.createAddress(form);
      }
      resetForm();
      fetchAddresses();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await addressApi.deleteAddress(id);
      fetchAddresses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Addresses</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Address
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700">
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>
          <Input label="Label (e.g. Home, Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          <Input label="Recipient Name" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <Input label="Province" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
          </div>
          <Input label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-teal-600" />
            Set as default address
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Save'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {addresses.length === 0 && !showForm && (
          <p className="text-slate-500">No addresses yet.</p>
        )}
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{addr.label}</span>
                {addr.isDefault && <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">Default</span>}
              </div>
              <p className="mt-1 text-sm text-slate-600">{addr.recipientName} - {addr.phone}</p>
              <p className="text-xs text-slate-500">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-xs px-3 py-1" onClick={() => handleEdit(addr)}>Edit</Button>
              <Button variant="ghost" className="text-xs px-3 py-1 text-red-500" onClick={() => handleDelete(addr.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
