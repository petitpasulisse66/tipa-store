import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tipa Store - Boutik Anliy Ayisyen',
  description: 'Tipa Store - platfòm e-commerce pwofesyonèl pou telefòn, akseswa, elektwonik ak plis.',
  openGraph: {
    title: 'Tipa Store',
    description: 'Boutik anliy pwofesyonèl an Ayiti',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
