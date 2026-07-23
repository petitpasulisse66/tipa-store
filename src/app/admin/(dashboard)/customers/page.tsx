'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  createdAt: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jesyon Kliyan</h1>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chèche pa non oswa email..."
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button className="btn-secondary">Chèche</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Non</th>
              <th className="p-3">Kontak</th>
              <th className="p-3">Dat Enskripsyon</th>
              <th className="p-3">Total Kòmand</th>
              <th className="p-3">Total Achte</th>
              <th className="p-3">Estati</th>
              <th className="p-3">Aksyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Ap chaje...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Pa gen kliyan</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 font-medium">{c.fullName}</td>
                  <td className="p-3 text-gray-500">{c.email}<br />{c.phone}</td>
                  <td className="p-3">{new Date(c.createdAt).toLocaleDateString('fr-HT')}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3">{formatCurrency(c.totalSpent)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Aktif' : 'Dezaktive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(c.id, c.isActive)} className="text-brand-600 text-xs font-medium">
                      {c.isActive ? 'Dezaktive' : 'Reaktive'}
                    </button>
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
