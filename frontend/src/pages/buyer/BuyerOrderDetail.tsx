import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import * as orderApi from '../../api/order.api';
import * as reviewApi from '../../api/review.api';
import { STATUS_LABELS, DELIVERY_LABELS } from '../../constants';
import type { Order } from '../../types';

export default function BuyerOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState<{ productId: number; rating: number; comment: string } | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }
    orderApi
      .getOrderDetail(Number(id))
      .then((res) => setOrder(res.order))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (productId: number) => {
    if (!reviewForm || reviewForm.productId !== productId) return;
    setSavingReview(true);
    setReviewMessage('');
    try {
      await reviewApi.createProductReview(productId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewMessage('Review submitted!');
      setReviewForm(null);
    } catch (err: unknown) {
      setReviewMessage(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (error && !order) return <p className="text-red-500">{error}</p>;
  if (!order) return <p className="text-slate-500">Order not found.</p>;

  const isCompleted = order.status === 'pesanan_selesai';

  return (
    <div>
      <Link to="/dashboard/buyer/orders" className="text-sm text-teal-600 hover:underline">
        &larr; Back to orders
      </Link>

      <h1 className="mt-4 text-xl md:text-2xl font-bold text-slate-800">Order #{order.id}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Items</h2>
          <div className="mt-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
                {isCompleted && (
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    {reviewForm?.productId === item.product.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Rating:</span>
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                              className={`text-lg cursor-pointer ${reviewForm.rating >= r ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Write a review..."
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReview(item.product.id)} disabled={savingReview || !reviewForm.comment}>
                            {savingReview ? 'Submitting...' : 'Submit Review'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setReviewForm(null)}>Cancel</Button>
                        </div>
                        {reviewMessage && <p className="text-xs text-teal-600">{reviewMessage}</p>}
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewForm({ productId: item.product.id, rating: 5, comment: '' })}
                        className="text-xs text-teal-600 hover:underline cursor-pointer"
                      >
                        Write a review
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-semibold text-slate-700">Status Timeline</h2>
          <div className="mt-3 space-y-3">
            {order.statusHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {STATUS_LABELS[h.status] || h.status}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(h.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
          <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            {order.store && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Store</span>
                <span className="font-medium">{order.store.name}</span>
              </div>
            )}
            {order.address && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Address</span>
                <span className="text-right text-xs text-slate-600 max-w-[200px]">
                  {order.address.recipientName} - {order.address.phone}<br />
                  {order.address.street}, {order.address.city}, {order.address.province} {order.address.postalCode}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span>{DELIVERY_LABELS[order.deliveryMethod] || order.deliveryMethod}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Coupon</span>
                <span className="text-green-600">{order.coupon.code}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span>Rp {Number(order.subtotal).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Discount</span>
              <span className="text-green-600">-Rp {Number(order.discount).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery Fee</span>
              <span>Rp {Number(order.deliveryFee).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">PPN 12%</span>
              <span>Rp {Number(order.ppn).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-teal-600">Rp {Number(order.total).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
