import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import * as deliveryApi from '../../api/delivery.api';
import { STATUS_LABELS } from '../../constants';
import type { Order } from '../../types';

export default function DriverDeliveryQueue() {
  const [jobs, setJobs] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taking, setTaking] = useState<number | null>(null);

  const fetchQueue = () => {
    setLoading(true);
    deliveryApi.getQueue()
      .then((res) => setJobs(res.jobs))
      .catch(() => setError('Failed to load delivery queue'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchQueue, []);

  const handleTake = async (id: number) => {
    setTaking(id);
    setError('');
    try {
      await deliveryApi.assignDelivery(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to take job');
    } finally {
      setTaking(null);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;
  if (error && jobs.length === 0) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Delivery Queue</h1>
      <p className="mt-1 text-sm text-slate-500">Available deliveries waiting for a driver</p>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {jobs.length === 0 ? (
        <p className="mt-6 text-slate-500">No deliveries available right now.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/dashboard/deliveries/${job.id}`}
                    className="text-sm font-semibold text-teal-600 hover:underline"
                  >
                    Order #{job.id}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {job.items.length} item(s) &middot; Rp {Number(job.total).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-400">
                    {job.store?.name} &middot; {new Date(job.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    {STATUS_LABELS[job.status] || job.status}
                  </span>
                  <Button
                    className="bg-teal-600 hover:bg-teal-500 text-white text-sm"
                    disabled={taking === job.id}
                    onClick={() => handleTake(job.id)}
                  >
                    {taking === job.id ? 'Taking...' : 'Ambil'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
