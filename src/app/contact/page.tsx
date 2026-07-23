'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: konekte ak /api/contact si w vle anrejistre/voye mesaj sa yo pa email
    setSent(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Kontakte Nou</h1>
        <p className="text-gray-600 mb-6">
          Ou gen yon kesyon, yon pwoblèm ak yon kòmand, oswa yon sijesyon? Ekri nou, nou la pou ede w.
        </p>
        <ul className="space-y-3 text-sm">
          <li>📞 Telefòn: +509 0000-0000</li>
          <li>✉️ Email: kontak@tipastore.com</li>
          <li>💬 WhatsApp: +509 0000-0000</li>
          <li>📍 Adrès: Pòtoprens, Ayiti</li>
        </ul>
        <div className="mt-6 rounded-xl overflow-hidden border h-56">
          <iframe
            title="Google Map"
            className="w-full h-full"
            src="https://www.google.com/maps?q=Port-au-Prince,Haiti&output=embed"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 h-fit">
        {sent ? (
          <p className="text-green-600 font-medium">✔ Mèsi! Mesaj ou voye, n ap reponn ou byento.</p>
        ) : (
          <>
            <input required placeholder="Non ou" className="border rounded-lg px-3 py-2 w-full"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Email" className="border rounded-lg px-3 py-2 w-full"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea required placeholder="Mesaj ou" rows={5} className="border rounded-lg px-3 py-2 w-full"
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="btn-primary w-full">Voye Mesaj</button>
          </>
        )}
      </form>
    </div>
  );
}
