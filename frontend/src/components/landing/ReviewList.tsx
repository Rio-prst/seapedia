import StarRating from '../ui/StarRating';
import type { Review } from '../../types';

interface Props {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading reviews...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800">User Reviews</h3>
      {reviews.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No reviews yet. Be the first!</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{r.reviewerName}</span>
                <StarRating value={r.rating} readonly />
              </div>
              <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
