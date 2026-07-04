import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as walletApi from '../../api/wallet.api';
import type { Wallet } from '../../types';

export default function BuyerTopUp() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    walletApi
      .getWallet()
      .then((res) => setWallet(res.wallet))
      .catch(() => setMessage('Failed to load wallet'))
      .finally(() => setLoading(false));
  }, []);

  const handleTopUp = async () => {
    setMessage('');
    setIsSuccess(false);
    setSaving(true);
    try {
      const res = await walletApi.topup(amount);
      setWallet(res.wallet);
      setIsSuccess(true);
      setMessage(`Top-up successful! Rp ${amount.toLocaleString('id-ID')} added.`);
    } catch (err: unknown) {
      setIsSuccess(false);
      setMessage(err instanceof Error ? err.message : 'Top-up failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Wallet</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 max-w-md">
        <p className="text-sm text-slate-500">Current Balance</p>
        <p className="mt-1 text-3xl font-bold text-teal-600">
          Rp {(wallet ? Number(wallet.balance) : 0).toLocaleString('id-ID')}
        </p>
      </div>

      <div className="mt-6 max-w-md space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Top Up Balance</h2>
        <Input
          label="Amount (Rp)"
          type="number"
          min={1000}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
        />
        <div className="flex flex-wrap gap-2">
          {[50000, 100000, 200000, 500000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`rounded-lg border px-3 py-1.5 text-sm cursor-pointer ${
                amount === v ? 'border-teal-600 bg-teal-50 text-teal-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Rp {v.toLocaleString('id-ID')}
            </button>
          ))}
        </div>
        <Button onClick={handleTopUp} disabled={saving || amount < 1000}>
          {saving ? 'Processing...' : 'Top Up'}
        </Button>
        {message && (
          <p className={`text-sm ${isSuccess ? 'text-teal-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>

      {wallet && wallet.transactions.length > 0 && (
        <div className="mt-8 max-w-lg">
          <h2 className="text-sm font-semibold text-slate-700">Transaction History</h2>
          <div className="mt-3 space-y-2">
            {wallet.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                <div>
                  <p className="text-sm text-slate-800">{tx.description}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  tx.type === 'topup' ? 'text-green-600' : tx.type === 'refund' ? 'text-blue-600' : 'text-red-500'
                }`}>
                  {tx.type === 'topup' || tx.type === 'refund' ? '+' : '-'}Rp {Number(tx.amount).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
