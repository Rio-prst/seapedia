import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import * as productsApi from '../../api/products.api';
import type { Product } from '../../types';

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getMyProducts()
      .then((res) => setProducts(res.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Products</h1>
        <Link to="/dashboard/seller/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No products yet.{' '}
          <Link to="/dashboard/seller/products/new" className="text-teal-600 underline">
            Add your first product
          </Link>
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Stock</th>
                <th className="py-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 text-slate-800">{p.name}</td>
                  <td className="py-3 pr-4 text-slate-800">
                    Rp {Number(p.price).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 pr-4 text-slate-800">{p.stock}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <Link to={`/dashboard/seller/products/${p.id}/edit`}>
                        <Button variant="outline" className="text-xs px-3 py-1">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="text-xs px-3 py-1 text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
