import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as deliveryApi from '../../api/delivery.api';
import { STATUS_LABELS } from '../../constants';
import type { Order } from '../../types';

export default function DriverMyDeliveries() {
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    deliveryApi.getMyDeliveries()
      .then((res) => setDeliveries(res.deliveries))
      .catch(() => setError('Failed to load deliveries'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = deliveries.filter((d) => {
    if (filter === 'active') return d.status === 'sedang_dikirim' || d.status === 'menunggu_pengirim';
    if (filter === 'completed') return d.status === 'pesanan_selesai';
    return true;
  });

  const completedCount = deliveries.filter((d) => d.status === 'pesanan_selesai').length;
  const earnings = deliveries
    .filter((d) => d.status === 'pesanan_selesai')
    .reduce((sum, d) => sum + Number(d.deliveryFee), 0);

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Deliveries</h1>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-xl font-bold text-teal-600">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Earnings</p>
          <p className="text-xl font-bold text-teal-600">Rp {earnings.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filter === f
                ? 'bg-teal-100 text-teal-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-slate-500">No deliveries found.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.map((d) => (
            <Link
              key={d.id}
              to={`/dashboard/deliveries/${d.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Order #{d.id}</p>
                  <p className="text-xs text-slate-500">
                    {d.store?.name} &middot; Rp {Number(d.total).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                  {STATUS_LABELS[d.status] || d.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Delivery Fee: Rp {Number(d.deliveryFee).toLocaleString('id-ID')} &middot;{' '}
                {new Date(d.createdAt).toLocaleDateString('id-ID')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
