'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || 'Erè koneksyon');
    router.push('/account');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Konekte</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <input required type="email" placeholder="Email" className="border rounded-lg px-3 py-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Modpas" className="border rounded-lg px-3 py-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Ap konekte...' : 'Konekte'}</button>
        <p className="text-sm text-center text-gray-500">
          Pa gen kont? <Link href="/register" className="text-brand-600 font-medium">Kreye youn</Link>
        </p>
      </form>
    </div>
  );
}
