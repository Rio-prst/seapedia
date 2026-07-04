import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Featured Products</h2>
        <p className="mt-2 text-sm text-slate-500">Discover our curated collection of ocean-inspired goods.</p>

        {loading && (
          <p className="mt-6 text-slate-400">Loading products...</p>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="mt-6 text-sm text-slate-400">No products available yet.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
