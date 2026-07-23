import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12 text-sm">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Tipa Store</h3>
          <p className="text-gray-300">
            Boutik anliy pwofesyonèl an Ayiti. Nou livre telefòn, aksesywa ak elektwonik nan tout depatman yo.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Lyen Rapid</h4>
          <ul className="space-y-2">
            <li><Link href="/products">Boutik</Link></li>
            <li><Link href="/about">Apropo Nou</Link></li>
            <li><Link href="/contact">Kontak</Link></li>
            <li><Link href="/support">Sipò</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Kont</h4>
          <ul className="space-y-2">
            <li><Link href="/login">Konekte</Link></li>
            <li><Link href="/register">Kreye Kont</Link></li>
            <li><Link href="/account/orders">Kòmand Mwen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Kontak</h4>
          <ul className="space-y-2 text-gray-300">
            <li>📞 +509 0000-0000</li>
            <li>✉️ kontak@tipastore.com</li>
            <li>📍 Pòtoprens, Ayiti</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Tipa Store. Tout dwa rezève.
      </div>
    </footer>
  );
}
