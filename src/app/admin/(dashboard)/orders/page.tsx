'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  status: string;
  total: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
  payment?: { method: string; status: string } | null;
}

const STATUSES = ['PENDING', 'ACCEPTED', 'PROCESSING', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'An Atant', ACCEPTED: 'Aksepte', PROCESSING: 'Ap Prepare',
  DELIVERED: 'Livre', CANCELLED: 'Anile', REFUNDED: 'Ranbouse',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/orders?${filter ? `status=${filter}` : ''}`);
    const data = await res.json();
    setOrders(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jesyon Kòmand</h1>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-sm border ${!filter ? 'bg-brand-600 text-white' : ''}`}>
          Tout
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${filter === s ? 'bg-brand-600 text-white' : ''}`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Kòmand</th>
              <th className="p-3">Kliyan</th>
              <th className="p-3">Atik</th>
              <th className="p-3">Total</th>
              <th className="p-3">Peman</th>
              <th className="p-3">Estati</th>
              <th className="p-3">Chanje Estati</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Ap chaje...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Pa gen kòmand</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t align-top">
                  <td className="p-3 font-medium">#{o.orderNumber}<br />
                    <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('fr-HT')}</span>
                  </td>
                  <td className="p-3">{o.fullName}<br /><span className="text-xs text-gray-500">{o.phone}</span></td>
                  <td className="p-3 text-xs">
                    {o.items.map((i, idx) => <div key={idx}>{i.name} × {i.quantity}</div>)}
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(o.total)}</td>
                  <td className="p-3 text-xs">
                    {o.payment?.method}<br />
                    <span className={o.payment?.status === 'PAID' ? 'text-green-600' : 'text-orange-500'}>
                      {o.payment?.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-brand-50 text-brand-700">{STATUS_LABELS[o.status]}</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
