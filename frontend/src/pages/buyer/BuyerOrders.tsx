import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderApi from '../../api/order.api';
import { STATUS_LABELS } from '../../constants';
import type { Order } from '../../types';

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then((res) => setOrders(res.orders))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-slate-500">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/dashboard/buyer/orders/${order.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Order #{order.id}
                  </p>
                  {order.store && (
                    <p className="text-xs text-slate-500">{order.store.name}</p>
                  )}
                </div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Rp {Number(order.total).toLocaleString('id-ID')}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
