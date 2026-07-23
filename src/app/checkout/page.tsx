'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

const SHIPPING_FEE = 150;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '', phone: '', whatsapp: '', email: '', address: '', city: '', department: '', note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'MONCASH' | 'NATCASH'>('MONCASH');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const total = subtotal + SHIPPING_FEE;
  const paymentNumber = paymentMethod === 'MONCASH' ? '+509 0000-0000' : '+509 0000-0000';

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let screenshotUrl: string | undefined;

      if (screenshot) {
        const fd = new FormData();
        fd.append('file', screenshot);
        fd.append('folder', 'tipa-store/payments');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Erè upload screenshot');
        screenshotUrl = uploadData.url;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          screenshotUrl,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erè pandan kreyasyon kòmand');

      setOrderNumber(data.order.orderNumber);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (orderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">✅</p>
        <h1 className="text-2xl font-bold mb-2">Kòmand ou anrejistre!</h1>
        <p className="text-gray-600 mb-6">
          Nimewo kòmand ou se <strong>#{orderNumber}</strong>. Nou pral verifye peman an epi kontakte w pou konfimasyon
          sou WhatsApp/Email.
        </p>
        <a href="/account/orders" className="btn-primary">Wè Kòmand Mwen</a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Panye w vid. Ajoute pwodwi anvan w kontinye nan peman.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* FÒM KÒMAND */}
        <div className="card p-6">
          <h2 className="font-bold mb-4">Enfòmasyon Livrezon</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Non Konplè" className="border rounded-lg px-3 py-2"
              value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            <input required placeholder="Telefòn" className="border rounded-lg px-3 py-2"
              value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <input placeholder="WhatsApp (si diferan)" className="border rounded-lg px-3 py-2"
              value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            <input type="email" placeholder="Email (opsyonèl)" className="border rounded-lg px-3 py-2"
              value={form.email} onChange={(e) => update('email', e.target.value)} />
            <input required placeholder="Adrès" className="border rounded-lg px-3 py-2 md:col-span-2"
              value={form.address} onChange={(e) => update('address', e.target.value)} />
            <input required placeholder="Vil" className="border rounded-lg px-3 py-2"
              value={form.city} onChange={(e) => update('city', e.target.value)} />
            <input required placeholder="Depatman" className="border rounded-lg px-3 py-2"
              value={form.department} onChange={(e) => update('department', e.target.value)} />
            <textarea placeholder="Nòt (opsyonèl)" className="border rounded-lg px-3 py-2 md:col-span-2"
              value={form.note} onChange={(e) => update('note', e.target.value)} />
          </div>
        </div>

        {/* PEMAN */}
        <div className="card p-6">
          <h2 className="font-bold mb-4">Metòd Peman</h2>
          <div className="flex gap-4 mb-4">
            {(['MONCASH', 'NATCASH'] as const).map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 border rounded-lg py-3 font-semibold ${
                  paymentMethod === method ? 'border-brand-600 bg-brand-50 text-brand-700' : ''
                }`}
              >
                {method === 'MONCASH' ? '📲 MonCash' : '📲 NatCash'}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
            <p>Voye <strong>{formatCurrency(total)}</strong> nan nimewo:</p>
            <p className="text-lg font-bold text-brand-700">{paymentNumber}</p>
          </div>

          <label className="block text-sm font-medium mb-1">Telechaje Screenshot Peman *</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      <div className="card p-6 h-fit">
        <h2 className="font-bold mb-4">Rezime</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm mb-1">
            <span>{i.name} × {i.quantity}</span>
            <span>{formatCurrency(i.price * i.quantity)}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between text-sm mb-1">
          <span>Sou-total</span><span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span>Livrezon</span><span>{formatCurrency(SHIPPING_FEE)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span><span>{formatCurrency(total)}</span>
        </div>
        <button disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Ap Valide...' : 'Valide Kòmand'}
        </button>
      </div>
    </form>
  );
}
