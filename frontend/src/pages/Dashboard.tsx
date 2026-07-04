import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as dashboardApi from '../api/dashboard.api';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">
        Welcome, {user?.username}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        You are signed in as{' '}
        <span className="font-medium text-teal-600 capitalize">{user?.activeRole}</span>.
      </p>
      <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 md:p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-teal-800">Active Role</h3>
          <p className="mt-2 text-2xl font-bold text-teal-600 capitalize">{user?.activeRole}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Roles</h3>
          <p className="mt-2 text-2xl font-bold text-slate-600">{user?.roles.length}</p>
        </div>
        {user?.activeRole === 'seller' && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-indigo-800">Store</h3>
            <p className="mt-2 text-sm text-indigo-600">{loading ? '...' : stats?.storeName || 'No store'}</p>
          </div>
        )}
        {user?.activeRole === 'seller' && (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-purple-800">Products</h3>
            <p className="mt-2 text-2xl font-bold text-purple-600">{loading ? '...' : stats?.productCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'seller' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-800">Orders</h3>
            <p className="mt-2 text-2xl font-bold text-blue-600">{loading ? '...' : stats?.orderCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'seller' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-green-800">Revenue</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {loading ? '...' : `Rp ${Number(stats?.revenue ?? 0).toLocaleString('id-ID')}`}
            </p>
          </div>
        )}
        {user?.activeRole === 'buyer' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-800">Orders</h3>
            <p className="mt-2 text-2xl font-bold text-blue-600">{loading ? '...' : stats?.orderCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'buyer' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-emerald-800">Wallet Balance</h3>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {loading ? '...' : `Rp ${Number(stats?.balance ?? 0).toLocaleString('id-ID')}`}
            </p>
          </div>
        )}
        {user?.activeRole === 'driver' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-amber-800">Total Deliveries</h3>
            <p className="mt-2 text-2xl font-bold text-amber-600">{loading ? '...' : stats?.totalDeliveries ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'driver' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-800">In Progress</h3>
            <p className="mt-2 text-2xl font-bold text-blue-600">{loading ? '...' : stats?.inProgress ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'driver' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-green-800">Completed</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">{loading ? '...' : stats?.completed ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'driver' && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-teal-800">Earnings</h3>
            <p className="mt-2 text-2xl font-bold text-teal-600">
              {loading ? '...' : `Rp ${Number(stats?.earnings ?? 0).toLocaleString('id-ID')}`}
            </p>
          </div>
        )}
        {user?.activeRole === 'admin' && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-indigo-800">Users</h3>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{loading ? '...' : stats?.userCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'admin' && (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-purple-800">Stores</h3>
            <p className="mt-2 text-2xl font-bold text-purple-600">{loading ? '...' : stats?.storeCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'admin' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-800">Products</h3>
            <p className="mt-2 text-2xl font-bold text-blue-600">{loading ? '...' : stats?.productCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'admin' && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-teal-800">Orders</h3>
            <p className="mt-2 text-2xl font-bold text-teal-600">{loading ? '...' : stats?.orderCount ?? 0}</p>
          </div>
        )}
        {user?.activeRole === 'admin' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-amber-800">Coupons</h3>
            <p className="mt-2 text-2xl font-bold text-amber-600">{loading ? '...' : stats?.couponCount ?? 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}
