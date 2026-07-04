import { useState, type FormEvent } from 'react';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';

interface Props {
  onSubmit: (name: string, rating: number, comment: string) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rating || !comment.trim()) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), rating, comment.trim());
      setName('');
      setRating(0);
      setComment('');
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Leave a Review</h3>
      <p className="mt-1 text-sm text-slate-500">Tell us what you think about SEAPEDIA!</p>
      <div className="mt-4 space-y-4">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <span className="text-sm font-medium text-slate-700">Rating</span>
          <div className="mt-1">
            <StarRating value={rating} onChange={setRating} />
          </div>
        </div>
        <Textarea
          label="Comment"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
