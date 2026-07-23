'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  promoPrice?: string | null;
  stock: number;
  isActive: boolean;
  category: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&limit=50`);
    const data = await res.json();
    setProducts(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Efase pwodwi sa a?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jesyon Pwodwi</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm">+ Ajoute Pwodwi</Link>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); load(); }}
        className="flex gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chèche pa non..."
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button className="btn-secondary">Chèche</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Non</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Pri</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estati</th>
              <th className="p-3">Aksyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Ap chaje...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Pa gen pwodwi</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-500">{p.sku}</td>
                  <td className="p-3">{p.category?.name}</td>
                  <td className="p-3">
                    {formatCurrency(p.promoPrice || p.price)}
                    {p.promoPrice && <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(p.price)}</span>}
                  </td>
                  <td className={`p-3 ${p.stock <= 5 ? 'text-red-600 font-semibold' : ''}`}>{p.stock}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Aktif' : 'Inaktif'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 text-xs font-medium">
                      Efase
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
