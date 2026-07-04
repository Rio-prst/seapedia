import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import * as adminApi from '../../api/admin.api';
import { STATUS_LABELS, DELIVERY_LABELS } from '../../constants';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = () => {
    setLoading(true);
    adminApi.getOrders()
      .then((res) => setOrders(res.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  const handleProcessOverdue = async () => {
    setProcessing(true);
    setMessage('');
    try {
      const res = await adminApi.processOverdue();
      setMessage(`Processed ${res.count} overdue order(s): #${res.processed.join(', #')}`);
      fetchOrders();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to process overdue');
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulateDay = async () => {
    setProcessing(true);
    setMessage('');
    try {
      const res = await adminApi.simulateTime(24);
      setMessage(res.message);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to simulate time');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">All Orders</h1>
      <p className="mt-1 text-sm text-slate-500">{orders.length} order(s)</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {['all', 'sedang_dikemas', 'menunggu_pengirim', 'sedang_dikirim', 'pesanan_selesai', 'dikembalikan'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            className="bg-amber-600 hover:bg-amber-500 text-white text-sm"
            disabled={processing}
            onClick={handleSimulateDay}
          >
            {processing ? 'Processing...' : 'Simulate +1 Day'}
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-500 text-white text-sm"
            disabled={processing}
            onClick={handleProcessOverdue}
          >
            {processing ? 'Processing...' : 'Process Overdue'}
          </Button>
        </div>
      </div>

      {message && (
        <p className="mt-3 text-sm text-teal-600">{message}</p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Buyer</th>
              <th className="pb-2 font-medium">Store</th>
              <th className="pb-2 font-medium">Total</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Delivery</th>
              <th className="pb-2 font-medium">Driver</th>
              <th className="pb-2 font-medium">Deadline</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2">{o.id}</td>
                <td className="py-2">{o.buyer?.username || o.buyerId}</td>
                <td className="py-2 text-slate-500">{o.store?.name}</td>
                <td className="py-2 font-medium">Rp {Number(o.total).toLocaleString('id-ID')}</td>
                <td className="py-2">
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700">
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </td>
                <td className="py-2 text-xs text-slate-500">{DELIVERY_LABELS[o.deliveryMethod] || o.deliveryMethod}</td>
                <td className="py-2 text-xs text-slate-500">{o.driver?.username || '-'}</td>
                <td className="py-2 text-xs text-slate-500">
                  {o.deliveryDeadline ? new Date(o.deliveryDeadline).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="py-2 text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
