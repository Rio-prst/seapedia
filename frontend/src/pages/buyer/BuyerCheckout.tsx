import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as cartApi from '../../api/cart.api';
import * as walletApi from '../../api/wallet.api';
import * as orderApi from '../../api/order.api';
import * as addressApi from '../../api/address.api';
import type { Cart, Wallet, Address, DeliveryMethod } from '../../types';

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; fee: number }[] = [
  { value: 'instant', label: 'Instant', fee: 25000 },
  { value: 'next_day', label: 'Next Day', fee: 15000 },
  { value: 'regular', label: 'Regular', fee: 8000 },
];

export default function BuyerCheckout() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('regular');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      cartApi.getCart().then((r) => setCart(r.cart)),
      walletApi.getWallet().then((r) => setWallet(r.wallet)),
      addressApi.getAddresses().then((r) => {
        setAddresses(r.addresses);
        const defaultAddr = r.addresses.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (r.addresses.length > 0) setSelectedAddressId(r.addresses[0].id);
      }),
    ]).catch((err: unknown) => {
      setLoadError(err instanceof Error ? err.message : 'Failed to load data');
    });
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.value === deliveryMethod)?.fee || 0;
  const discount = 0;
  const taxable = subtotal - discount;
  const ppn = Math.round(taxable * 0.12);
  const total = taxable + ppn + deliveryFee;
  const balance = wallet ? Number(wallet.balance) : 0;

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const code = couponCode.trim() || undefined;
      const res = await orderApi.checkout(deliveryMethod, selectedAddressId, code);
      navigate(`/dashboard/buyer/orders/${res.order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) return <div className="text-red-500">{loadError}</div>;
  if (!cart || !wallet) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Checkout</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-slate-500">Your cart is empty.</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Items</h2>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between rounded-lg border border-slate-200 bg-white p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-semibold text-slate-700">Shipping Address</h2>
            {addresses.length === 0 ? (
              <p className="mt-2 text-sm text-red-500">
                No addresses found.{' '}
                <a href="/dashboard/buyer/addresses" className="text-teal-600 underline">
                  Add an address
                </a>
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {addresses.map((addr) => (
                  <label key={addr.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-teal-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {addr.label} {addr.isDefault && <span className="text-xs text-teal-600">(Default)</span>}
                      </p>
                      <p className="text-xs text-slate-500">{addr.recipientName} - {addr.phone}</p>
                      <p className="text-xs text-slate-400">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <h2 className="mt-6 text-sm font-semibold text-slate-700">Delivery Method</h2>
            <div className="mt-3 space-y-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={deliveryMethod === opt.value}
                    onChange={() => setDeliveryMethod(opt.value)}
                    className="accent-teal-600"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{opt.label}</p>
                    <p className="text-xs text-slate-500">Rp {opt.fee.toLocaleString('id-ID')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700">Coupon</h2>
            <div className="mt-3">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>

            <h2 className="mt-6 text-sm font-semibold text-slate-700">Summary</h2>
            <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <span className="text-green-600">-Rp {discount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery Fee ({DELIVERY_OPTIONS.find(d => d.value === deliveryMethod)?.label})</span>
                <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">PPN 12%</span>
                <span>Rp {ppn.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-teal-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Wallet Balance</span>
                <span className={balance >= total ? 'text-green-600' : 'text-red-500'}>
                  Rp {balance.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <Button
              className="mt-4 w-full"
              disabled={submitting || balance < total || addresses.length === 0}
              onClick={handleCheckout}
            >
              {submitting ? 'Processing...' : balance < total ? 'Insufficient Balance' : 'Place Order'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
