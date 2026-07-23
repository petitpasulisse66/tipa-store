'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(typeof data.error === 'string' ? data.error : 'Verifye enfòmasyon ou');
    router.push('/account');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Kreye Kont</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <input required placeholder="Non Konplè" className="border rounded-lg px-3 py-2 w-full"
          value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required type="email" placeholder="Email" className="border rounded-lg px-3 py-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Telefòn" className="border rounded-lg px-3 py-2 w-full"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required type="password" placeholder="Modpas" className="border rounded-lg px-3 py-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Ap kreye...' : 'Kreye Kont'}</button>
        <p className="text-sm text-center text-gray-500">
          Ou gen yon kont deja? <Link href="/login" className="text-brand-600 font-medium">Konekte</Link>
        </p>
      </form>
    </div>
  );
}
