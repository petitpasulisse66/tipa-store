'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', icon: '' });
    setSaving(false);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jesyon Kategori</h1>

      <form onSubmit={handleSubmit} className="card p-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Non Kategori</label>
          <input required className="border rounded-lg px-3 py-2 w-full"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Icon (emoji)</label>
          <input className="border rounded-lg px-3 py-2 w-24"
            value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
        <button disabled={saving} className="btn-primary">Ajoute</button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="card p-4 flex items-center gap-3">
            <span className="text-2xl">{c.icon || '🛍️'}</span>
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-gray-500">{c._count?.products || 0} pwodwi</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
