'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', brand: '',
    price: '', promoPrice: '', stock: '0', tags: '', colors: '', sizes: '',
    isFeatured: false, isNew: false, isBestSeller: false, isFlashSale: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'tipa-store/products');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setImages((prev) => [...prev, data.url]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        promoPrice: form.promoPrice ? Number(form.promoPrice) : undefined,
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        colors: form.colors.split(',').map((t) => t.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((t) => t.trim()).filter(Boolean),
        images,
      }),
    });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || 'Erè pandan kreyasyon pwodwi');
    router.push('/admin/products');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Ajoute Nouvo Pwodwi</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input required placeholder="Non Pwodwi" className="border rounded-lg px-3 py-2"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="SKU" className="border rounded-lg px-3 py-2"
            value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <select required className="border rounded-lg px-3 py-2"
            value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Chwazi Kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Brand" className="border rounded-lg px-3 py-2"
            value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input required type="number" placeholder="Pri" className="border rounded-lg px-3 py-2"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" placeholder="Pri Promo (opsyonèl)" className="border rounded-lg px-3 py-2"
            value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} />
          <input required type="number" placeholder="Stock" className="border rounded-lg px-3 py-2"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input placeholder="Tags (separe ak vigil)" className="border rounded-lg px-3 py-2"
            value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <input placeholder="Koulè (separe ak vigil)" className="border rounded-lg px-3 py-2"
            value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
          <input placeholder="Gwosè (separe ak vigil)" className="border rounded-lg px-3 py-2"
            value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
        </div>

        <textarea required rows={4} placeholder="Deskripsyon" className="border rounded-lg px-3 py-2 w-full"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div>
          <label className="block text-sm font-medium mb-2">Imaj Pwodwi</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          <div className="flex gap-2 mt-2">
            {images.map((img) => (
              <img key={img} src={img} className="w-16 h-16 object-cover rounded border" alt="" />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {(['isFeatured', 'isNew', 'isBestSeller', 'isFlashSale'] as const).map((field) => (
            <label key={field} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.checked })}
              />
              {field === 'isFeatured' && 'Rekòmande'}
              {field === 'isNew' && 'Nouvo'}
              {field === 'isBestSeller' && 'Pi Vann'}
              {field === 'isFlashSale' && 'Flash Sale'}
            </label>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={saving} className="btn-primary">{saving ? 'Ap anrejistre...' : 'Anrejistre Pwodwi'}</button>
      </form>
    </div>
  );
}
