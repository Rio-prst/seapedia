import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as couponApi from '../../api/coupon.api';
import type { Coupon } from '../../types';

export default function SellerCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percent' as 'percent' | 'nominal',
    value: '0',
    minPurchase: '0',
    maxUsage: '0',
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    couponApi.getCoupons()
      .then((res) => setCoupons(res.coupons))
      .catch(() => setError('Failed to load coupons'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCoupons, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await couponApi.createCoupon({
        code: form.code,
        type: form.type,
        value: form.type === 'percent' ? Math.min(100, parseInt(form.value) || 0) : parseInt(form.value) || 0,
        minPurchase: parseInt(form.minPurchase) || 0,
        maxUsage: parseInt(form.maxUsage) || 0,
      });
      setShowForm(false);
      setForm({ code: '', type: 'percent', value: '0', minPurchase: '0', maxUsage: '0' });
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await couponApi.deleteCoupon(id);
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete coupon');
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Coupons</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Coupon'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700">New Coupon</h2>
          <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <div>
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'nominal' })}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="percent">Percent (%)</option>
              <option value="nominal">Nominal (Rp)</option>
            </select>
          </div>
          <Input
            label={form.type === 'percent' ? 'Value (%)' : 'Value (Rp)'}
            type="number"
            min={0}
            max={form.type === 'percent' ? 100 : undefined}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
          <Input
            label="Min Purchase (0 = no minimum)"
            type="number"
            min={0}
            value={form.minPurchase}
            onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
          />
          <Input
            label="Max Usage (0 = unlimited)"
            type="number"
            min={0}
            value={form.maxUsage}
            onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Coupon'}</Button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {coupons.length === 0 && !showForm && (
          <p className="text-slate-500">No coupons yet.</p>
        )}
        {coupons.map((coupon) => (
          <div key={coupon.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{coupon.code}</span>
                <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">
                  {coupon.type === 'percent' ? `${coupon.value}%` : `Rp ${Number(coupon.value).toLocaleString('id-ID')}`}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Used: {coupon.usageCount}{coupon.maxUsage > 0 ? ` / ${coupon.maxUsage}` : ''}
                {coupon.minPurchase != null && coupon.minPurchase > 0 && ` | Min: Rp ${Number(coupon.minPurchase).toLocaleString('id-ID')}`}
                {coupon._count && ` | Orders: ${coupon._count.orders}`}
              </p>
            </div>
            <Button variant="ghost" className="text-red-500 text-xs px-3 py-1" onClick={() => handleDelete(coupon.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
