'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
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
    if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPER_ADMIN') {
      return setError('Kont sa a pa gen aksè administratè');
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Tipa Store — Admin</h1>
        <input required type="email" placeholder="Email Admin" className="border rounded-lg px-3 py-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Modpas" className="border rounded-lg px-3 py-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Ap konekte...' : 'Konekte'}</button>
      </form>
    </div>
  );
}
