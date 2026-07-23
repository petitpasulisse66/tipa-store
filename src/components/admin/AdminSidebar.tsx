'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/products', label: '📦 Pwodwi' },
  { href: '/admin/categories', label: '🗂️ Kategori' },
  { href: '/admin/orders', label: '🧾 Kòmand' },
  { href: '/admin/payments', label: '💳 Peman' },
  { href: '/admin/customers', label: '👥 Kliyan' },
  { href: '/admin/cms', label: '🎨 CMS Paj Akèy' },
  { href: '/admin/reports', label: '📈 Rapò' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-60 bg-brand-900 text-white min-h-screen p-4 shrink-0">
      <div className="text-xl font-extrabold mb-8 px-2">
        Tipa<span className="text-gold-500">Admin</span>
      </div>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === link.href ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 px-2">
        <button onClick={handleLogout} className="text-xs text-gray-300 hover:text-white">
          ⏻ Dekonekte
        </button>
      </div>
    </aside>
  );
}
