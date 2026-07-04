import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as productsApi from '../../api/products.api';
import * as cartApi from '../../api/cart.api';
import * as reviewApi from '../../api/review.api';
import type { Product, ProductReview } from '../../types';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const isBuyer = user?.activeRole === 'buyer';

  useEffect(() => {
    if (!id) return;
    Promise.all([
      productsApi.getProductById(Number(id)).then((res) => setProduct(res.product)),
      reviewApi.getProductReviews(Number(id)).then((res) => setReviews(res.reviews)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isBuyer) {
      setMessage('Please switch to Buyer role to add items to cart.');
      return;
    }
    if (!product) return;

    setMessage('');
    setAdding(true);
    try {
      await cartApi.addCartItem(product.id, quantity);
      setMessage(`Added ${quantity} item(s) to cart!`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add to cart';
      setMessage(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) return (
    <PublicLayout>
      <p className="mt-6 text-slate-500 text-center">Loading...</p>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/" className="text-sm text-teal-600 hover:underline">
          &larr; Back to catalog
        </Link>

        {!product ? (
          <p className="mt-6 text-slate-500">Product not found.</p>
        ) : (
          <>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-6xl">
                🛍️
              </div>
              <div>
                <p className="text-xs font-medium text-teal-600 uppercase tracking-wider">
                  {product.store?.name || 'Unknown Store'}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-800">{product.name}</h1>
                <p className="mt-4 text-3xl font-bold text-teal-600">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
                {product.description && (
                  <p className="mt-4 text-sm text-slate-500">{product.description}</p>
                )}

                {reviews.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">
                      {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                    </span>
                    <span className="text-sm text-slate-500">
                      {avgRating.toFixed(1)} ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {product.stock > 0 && (
                  <div className="mt-6 space-y-4">
                    {isBuyer && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">Qty:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="rounded border border-slate-300 px-2 py-1 text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="rounded border border-slate-300 px-2 py-1 text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddToCart}
                      disabled={adding || (!isBuyer && !!user)}
                    >
                      {adding ? 'Adding...' : isBuyer ? 'Add to Cart' : user ? 'Switch to Buyer role' : 'Login to Buy'}
                    </Button>

                    {message && (
                      <p className={`text-sm ${message.includes('Added') || message.includes('cart!') ? 'text-teal-600' : 'text-red-500'}`}>
                        {message}
                      </p>
                    )}

                    <Link
                      to="/dashboard/buyer/cart"
                      className="ml-3 text-sm text-teal-600 hover:underline"
                    >
                      View Cart
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold text-slate-800">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">
                            {review.buyer?.username || 'Anonymous'}
                          </span>
                          <span className="text-yellow-400 text-sm">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
