import PublicLayout from '../components/layout/PublicLayout';
import ProductGrid from '../components/landing/ProductGrid';
import ReviewForm from '../components/landing/ReviewForm';
import ReviewList from '../components/landing/ReviewList';
import { useReviews } from '../hooks/useReviews';

export default function Landing() {
  const { reviews, loading, submitReview } = useReviews();

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-teal-600 to-slate-800 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Sea Your Product
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-teal-100">
            Discover ocean-inspired treasures delivered to your doorstep.
          </p>
        </div>
      </section>
      <ProductGrid />
      <section className="border-t border-slate-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">App Review</h2>
          <p className="mt-2 text-sm text-slate-500">
            Help us improve by sharing your feedback.
          </p>
          <div className="mt-6 md:mt-8 grid gap-6 md:gap-8 lg:grid-cols-2">
            <ReviewForm onSubmit={submitReview} />
            <ReviewList reviews={reviews} loading={loading} />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
