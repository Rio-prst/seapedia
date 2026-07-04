import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import * as deliveryApi from '../../api/delivery.api';
import { STATUS_LABELS, DELIVERY_LABELS } from '../../constants';
import type { Order } from '../../types';

const STATUS_ACTIONS: { status: string; label: string; color: string }[] = [
  { status: 'sedang_dikirim', label: 'Mark as Shipped', color: 'bg-blue-600 hover:bg-blue-500' },
  { status: 'pesanan_selesai', label: 'Mark as Completed', color: 'bg-green-600 hover:bg-green-500' },
  { status: 'dikembalikan', label: 'Return', color: 'bg-red-600 hover:bg-red-500' },
];

export default function DriverDeliveryDetail() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Delivery ID is missing');
      setLoading(false);
      return;
    }
    deliveryApi.getDeliveryDetail(Number(id))
      .then((res) => setDelivery(res.delivery))
      .catch(() => setError('Failed to load delivery'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!delivery) return;
    setUpdating(true);
    setError('');
    try {
      const res = await deliveryApi.updateDeliveryStatus(delivery.id, newStatus);
      setDelivery(res.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (error && !delivery) return <p className="text-red-500">{error}</p>;
  if (!delivery) return <p className="text-slate-500">Delivery not found.</p>;

  return (
    <div>
      <Link to="/dashboard/deliveries/mine" className="text-sm text-teal-600 hover:underline">
        &larr; Back to my deliveries
      </Link>

      <h1 className="mt-4 text-xl md:text-2xl font-bold text-slate-800">Delivery for Order #{delivery.id}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Items</h2>
          <div className="mt-3 space-y-2">
            {delivery.items.map((item) => (
              <div key={item.id} className="flex justify-between rounded-lg border border-slate-200 bg-white p-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.product.name}</p>
                  <p className="text-xs text-slate-500">x{item.quantity}</p>
                </div>
                <p className="text-sm font-medium">
                  Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-700">Buyer</h2>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <p className="font-medium text-slate-800">{delivery.buyer?.username || `User #${delivery.buyerId}`}</p>
            </div>
          </div>

          {delivery.address && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-700">Shipping Address</h2>
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-medium text-slate-800">{delivery.address.recipientName} - {delivery.address.phone}</p>
                <p className="text-xs text-slate-500">{delivery.address.street}, {delivery.address.city}, {delivery.address.province} {delivery.address.postalCode}</p>
              </div>
            </div>
          )}

          <h2 className="mt-6 text-sm font-semibold text-slate-700">Status Timeline</h2>
          <div className="mt-3 space-y-3">
            {delivery.statusHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{STATUS_LABELS[h.status] || h.status}</p>
                  <p className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
          <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Store</span>
              <span className="font-medium">{delivery.store?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span>{DELIVERY_LABELS[delivery.deliveryMethod] || delivery.deliveryMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery Fee</span>
              <span>Rp {Number(delivery.deliveryFee).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span>Rp {Number(delivery.subtotal).toLocaleString('id-ID')}</span>
            </div>
            {Number(delivery.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <span className="text-green-600">-Rp {Number(delivery.discount).toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">PPN 12%</span>
              <span>Rp {Number(delivery.ppn).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-teal-600">Rp {Number(delivery.total).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                {STATUS_LABELS[delivery.status] || delivery.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Earnings</span>
              <span className="font-medium text-green-600">
                Rp {Number(delivery.deliveryFee).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 space-y-2">
            {STATUS_ACTIONS.map((action) => (
              <Button
                key={action.status}
                className={`w-full ${action.color} text-white`}
                disabled={updating}
                onClick={() => handleUpdateStatus(action.status)}
              >
                {updating ? 'Updating...' : action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
