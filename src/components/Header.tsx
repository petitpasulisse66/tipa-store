'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalCount } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Bann anlè: kontak rapid */}
      <div className="hidden md:flex justify-between items-center bg-brand-900 text-white text-xs px-6 py-1.5">
        <span>📞 +509 0000-0000 &nbsp;|&nbsp; ✉️ kontak@tipastore.com</span>
        <span>Livrezon nan tout Ayiti 🇭🇹</span>
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4">
        <Link href="/" className="text-2xl font-extrabold text-brand-600 shrink-0">
          Tipa<span className="text-gold-500">Store</span>
        </Link>

        <form
          action="/products"
          className="hidden md:flex flex-1 max-w-xl items-center border rounded-lg overflow-hidden"
        >
          <input
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chèche yon pwodwi..."
            className="flex-1 px-4 py-2 outline-none"
          />
          <button className="bg-brand-600 text-white px-4 py-2">🔍</button>
        </form>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/account">👤 Kont mwen</Link>
          <Link href="/account/wishlist">♡ Wishlist</Link>
          <Link href="/cart" className="relative">
            🛒 Panye
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mega Menu */}
      <nav className="hidden md:flex gap-6 px-8 py-2 bg-brand-50 text-sm font-medium border-t border-gray-100">
        <Link href="/products">Tout Pwodwi</Link>
        <Link href="/products?category=telefòn">Telefòn</Link>
        <Link href="/products?category=aksesywa">Aksesywa</Link>
        <Link href="/products?flashSale=1" className="text-red-600 font-bold">
          ⚡ Flash Sale
        </Link>
        <Link href="/products?new=1">Nouvo Pwodwi</Link>
        <Link href="/about">Apropo</Link>
        <Link href="/contact">Kontak</Link>
        <Link href="/support">Sipò</Link>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 py-4 border-t">
          <Link href="/products">Tout Pwodwi</Link>
          <Link href="/products?flashSale=1">⚡ Flash Sale</Link>
          <Link href="/account">Kont mwen</Link>
          <Link href="/cart">Panye ({totalCount})</Link>
          <Link href="/contact">Kontak</Link>
        </div>
      )}
    </header>
  );
}
