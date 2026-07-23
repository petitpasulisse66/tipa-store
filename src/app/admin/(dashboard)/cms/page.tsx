'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  type: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  imageUrl?: string | null;
  colorHex?: string | null;
  position: number;
  isActive: boolean;
}

const SECTION_TYPES = [
  'HERO_SLIDER', 'PROMO_BANNER', 'POPULAR_CATEGORIES', 'RECOMMENDED_PRODUCTS',
  'NEW_PRODUCTS', 'BEST_SELLERS', 'FLASH_SALE', 'STORE_BENEFITS',
  'TESTIMONIALS', 'PARTNER_LOGOS', 'BLOG', 'FAQ', 'NEWSLETTER',
];

export default function AdminCmsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [newType, setNewType] = useState(SECTION_TYPES[0]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/cms/sections?all=1');
    const data = await res.json();
    setSections(data.sections || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addSection() {
    await fetch('/api/cms/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newType, title: 'Tit Nouvo Seksyon' }),
    });
    load();
  }

  async function toggleActive(s: Section) {
    await fetch('/api/cms/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: [{ id: s.id, isActive: !s.isActive, position: s.position }] }),
    });
    load();
  }

  async function updateField(id: string, field: string, value: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function saveSection(s: Section) {
    await fetch('/api/cms/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: [s] }),
    });
    load();
  }

  async function moveSection(id: string, direction: -1 | 1) {
    const idx = sections.findIndex((s) => s.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    const updated = [...sections];
    [updated[idx].position, updated[swapIdx].position] = [updated[swapIdx].position, updated[idx].position];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setSections(updated);

    await fetch('/api/cms/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: [updated[idx], updated[swapIdx]] }),
    });
  }

  async function deleteSection(id: string) {
    if (!confirm('Efase seksyon sa a?')) return;
    await fetch(`/api/cms/sections/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CMS - Jesyon Paj Akèy</h1>
      <p className="text-sm text-gray-500">
        Modifye, aktive/dezaktive, oswa chanje lòd seksyon paj akèy la san bezwen touche kòd.
      </p>

      <div className="card p-4 flex gap-3 items-center">
        <select value={newType} onChange={(e) => setNewType(e.target.value)} className="border rounded-lg px-3 py-2">
          {SECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={addSection} className="btn-primary text-sm">+ Ajoute Seksyon</button>
      </div>

      {loading ? (
        <p className="text-gray-400">Ap chaje...</p>
      ) : (
        <div className="space-y-3">
          {sections.sort((a, b) => a.position - b.position).map((s, idx) => (
            <div key={s.id} className="card p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm bg-brand-50 text-brand-700 px-2 py-1 rounded">{s.type}</span>
                <div className="flex gap-2 items-center text-xs">
                  <button onClick={() => moveSection(s.id, -1)} disabled={idx === 0}>⬆️</button>
                  <button onClick={() => moveSection(s.id, 1)} disabled={idx === sections.length - 1}>⬇️</button>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={s.isActive} onChange={() => toggleActive(s)} />
                    Aktif
                  </label>
                  <button onClick={() => deleteSection(s.id)} className="text-red-600">Efase</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                <input placeholder="Tit" className="border rounded px-2 py-1 text-sm"
                  value={s.title || ''} onChange={(e) => updateField(s.id, 'title', e.target.value)} />
                <input placeholder="Soutit" className="border rounded px-2 py-1 text-sm"
                  value={s.subtitle || ''} onChange={(e) => updateField(s.id, 'subtitle', e.target.value)} />
                <input placeholder="Tèks Bouton" className="border rounded px-2 py-1 text-sm"
                  value={s.buttonText || ''} onChange={(e) => updateField(s.id, 'buttonText', e.target.value)} />
                <input placeholder="URL Bouton" className="border rounded px-2 py-1 text-sm"
                  value={s.buttonUrl || ''} onChange={(e) => updateField(s.id, 'buttonUrl', e.target.value)} />
                <input placeholder="URL Imaj" className="border rounded px-2 py-1 text-sm"
                  value={s.imageUrl || ''} onChange={(e) => updateField(s.id, 'imageUrl', e.target.value)} />
                <input placeholder="Koulè (#hex)" className="border rounded px-2 py-1 text-sm"
                  value={s.colorHex || ''} onChange={(e) => updateField(s.id, 'colorHex', e.target.value)} />
              </div>
              <button onClick={() => saveSection(s)} className="btn-secondary text-xs mt-3">Anrejistre Chanjman</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
