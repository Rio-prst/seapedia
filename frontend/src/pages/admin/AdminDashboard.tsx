import { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin.api';

const CARD_STYLES: Record<string, { border: string; bg: string; heading: string; value: string }> = {
  userCount: { border: 'border-indigo-200', bg: 'bg-indigo-50', heading: 'text-indigo-800', value: 'text-indigo-600' },
  storeCount: { border: 'border-purple-200', bg: 'bg-purple-50', heading: 'text-purple-800', value: 'text-purple-600' },
  productCount: { border: 'border-blue-200', bg: 'bg-blue-50', heading: 'text-blue-800', value: 'text-blue-600' },
  orderCount: { border: 'border-teal-200', bg: 'bg-teal-50', heading: 'text-teal-800', value: 'text-teal-600' },
  couponCount: { border: 'border-amber-200', bg: 'bg-amber-50', heading: 'text-amber-800', value: 'text-amber-600' },
};

const CARD_LABELS: Record<string, string> = {
  userCount: 'Users',
  storeCount: 'Stores',
  productCount: 'Products',
  orderCount: 'Orders',
  couponCount: 'Coupons',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAdminStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Marketplace overview</p>
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Object.keys(CARD_STYLES).map((key) => {
          const value = stats?.[key] ?? 0;
          const s = CARD_STYLES[key];
          return (
            <div key={key} className={`rounded-xl border ${s.border} ${s.bg} p-5 shadow-sm`}>
              <h3 className={`text-sm font-semibold ${s.heading}`}>{CARD_LABELS[key]}</h3>
              <p className={`mt-2 text-2xl font-bold ${s.value}`}>
                {loading ? '...' : value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
