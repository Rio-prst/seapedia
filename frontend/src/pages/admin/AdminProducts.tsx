import { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin.api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getProducts()
      .then((res) => setProducts(res.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">All Products</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} product(s)</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Store</th>
              <th className="pb-2 font-medium">Price</th>
              <th className="pb-2 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2">{p.id}</td>
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2 text-slate-500">{p.store?.name || '-'}</td>
                <td className="py-2">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td className="py-2">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
