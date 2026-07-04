import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import * as cartApi from '../../api/cart.api';
import type { Cart } from '../../types';

export default function BuyerCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const navigate = useNavigate();

  const fetchCart = () => {
    cartApi
      .getCart()
      .then((res) => setCart(res.cart))
      .catch(() => setLoadError('Failed to load cart'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const handleUpdateQty = async (productId: number, quantity: number) => {
    setActionError('');
    try {
      const res = await cartApi.updateCartItem(productId, quantity);
      setCart(res.cart);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update quantity';
      setActionError(msg);
    }
  };

  const handleRemove = async (productId: number) => {
    setActionError('');
    try {
      const res = await cartApi.removeCartItem(productId);
      setCart(res.cart);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove item';
      setActionError(msg);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (loadError) return <div className="text-red-500">{loadError}</div>;

  const items = cart?.items || [];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Cart</h1>

      {actionError && <p className="mt-3 text-sm text-red-500">{actionError}</p>}

      {items.length === 0 ? (
        <div className="mt-6">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link to="/" className="mt-2 inline-block text-sm text-teal-600 underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {cart?.store && (
            <p className="text-sm text-slate-500">
              Store: <span className="font-medium text-slate-700">{cart.store.name}</span>
            </p>
          )}
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">{item.product.name}</h3>
                <p className="mt-1 text-sm text-teal-600">
                  Rp {Number(item.product.price).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleUpdateQty(item.productId, Math.max(1, item.quantity - 1))}
                    className="rounded border border-slate-300 px-2 py-1 text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                    className="rounded border border-slate-300 px-2 py-1 text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right text-sm font-medium">
                  Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                </p>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => navigate('/dashboard/buyer/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
