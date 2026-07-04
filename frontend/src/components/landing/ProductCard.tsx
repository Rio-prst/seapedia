import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-300 text-4xl">
        🛍️
      </div>
      <div className="p-3 md:p-4">
        {product.store && (
          <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">
            {product.store.name}
          </span>
        )}
        <h3 className="mt-1 text-sm font-semibold text-slate-800">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base md:text-lg font-bold text-slate-800">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-400">Stock: {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
