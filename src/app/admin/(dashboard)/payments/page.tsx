'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Payment {
  id: string;
  method: string;
  status: string;
  amount: string;
  screenshotUrl?: string | null;
  createdAt: string;
  order: { orderNumber: string; fullName: string; phone: string; total: string };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/payments${filter ? `?status=${filter}` : ''}`);
    const data = await res.json();
    setPayments(data.payments || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function verify(id: string, action: 'APPROVE' | 'REJECT') {
    await fetch(`/api/payments/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verifikasyon Peman</h1>

      <div className="flex gap-2">
        {['PENDING', 'PAID', 'CANCELLED', ''].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${filter === s ? 'bg-brand-600 text-white' : ''}`}
          >
            {s || 'Tout'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Ap chaje...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">Pa gen peman pou montre.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p) => (
            <div key={p.id} className="card p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">#{p.order.orderNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-700">{p.method}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{p.order.fullName} · {p.order.phone}</p>
              <p className="font-bold text-brand-700 mb-3">{formatCurrency(p.amount)}</p>

              {p.screenshotUrl && (
                <a href={p.screenshotUrl} target="_blank" rel="noreferrer">
                  <img src={p.screenshotUrl} alt="Screenshot Peman" className="w-full max-h-64 object-contain rounded border mb-3" />
                </a>
              )}

              {p.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button onClick={() => verify(p.id, 'APPROVE')} className="btn-primary flex-1 text-sm">✔ Apwouve</button>
                  <button onClick={() => verify(p.id, 'REJECT')} className="btn-secondary flex-1 text-sm text-red-600 border-red-300">✘ Refize</button>
                </div>
              ) : (
                <span className={`text-sm font-semibold ${p.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                  {p.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
