import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import Countdown from '@/components/Countdown';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // done a chanje souvan (admin CMS) - pa mete an cache estatik

export default async function HomePage() {
  const [sections, categories, featured, newProducts, bestSellers, flashSale, testimonials, faqs] =
    await Promise.all([
      prisma.homeSection.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } }),
      prisma.category.findMany({ where: { parentId: null }, take: 8 }),
      prisma.product.findMany({ where: { isFeatured: true, isActive: true }, take: 8 }),
      prisma.product.findMany({ where: { isNew: true, isActive: true }, take: 8 }),
      prisma.product.findMany({ where: { isBestSeller: true, isActive: true }, take: 8 }),
      prisma.product.findMany({ where: { isFlashSale: true, isActive: true }, take: 6 }),
      prisma.testimonial.findMany({ where: { isActive: true }, take: 6 }),
      prisma.faqItem.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } }),
    ]);

  const heroSection = sections.find((s) => s.type === 'HERO_SLIDER');
  const heroSlides = heroSection
    ? [heroSection].map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        buttonText: s.buttonText,
        buttonUrl: s.buttonUrl,
        imageUrl: s.imageUrl,
        colorHex: s.colorHex,
      }))
    : [];

  const promoBanner = sections.find((s) => s.type === 'PROMO_BANNER');
  const storeBenefits = sections.find((s) => s.type === 'STORE_BENEFITS');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-14">
      {/* HERO SLIDER */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* PROMO BANNER */}
      {promoBanner && (
        <div
          className="rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ backgroundColor: promoBanner.colorHex || '#e8b13a' }}
        >
          <div>
            <h2 className="text-xl font-bold">{promoBanner.title}</h2>
            <p className="text-sm">{promoBanner.subtitle}</p>
          </div>
          {promoBanner.buttonText && (
            <Link href={promoBanner.buttonUrl || '/products'} className="btn-secondary bg-white">
              {promoBanner.buttonText}
            </Link>
          )}
        </div>
      )}

      {/* KATEGORI POPILÈ */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Kategori Popilè</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="card p-4 flex flex-col items-center gap-2 hover:shadow-md text-center text-sm font-medium"
              >
                <span className="text-3xl">{cat.icon || '🛍️'}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FLASH SALE */}
      {flashSale.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">⚡ Flash Sale</h2>
            {flashSale[0].flashSaleEnds && <Countdown endsAt={flashSale[0].flashSaleEnds} />}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {flashSale.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }} />
            ))}
          </div>
        </section>
      )}

      {/* PWODWI REKÒMANDE */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Pwodwi Rekòmande</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }} />
            ))}
          </div>
        </section>
      )}

      {/* NOUVO PWODWI */}
      {newProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Nouvo Pwodwi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }} />
            ))}
          </div>
        </section>
      )}

      {/* PWODWI KI PI VANN */}
      {bestSellers.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Pwodwi ki Pi Vann</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }} />
            ))}
          </div>
        </section>
      )}

      {/* AVANTAJ MAGAZEN AN */}
      {storeBenefits && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {['🚚 Livrezon Rapid', '🔒 Peman Sekirize', '↩️ Retou Fasil', '💬 Sipò 24/7'].map((b) => (
            <div key={b} className="card p-4 font-medium">
              {b}
            </div>
          ))}
        </section>
      )}

      {/* TEMWAYAJ KLIYAN */}
      {testimonials.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Sa Kliyan Nou Yo Di</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="card p-5">
                <div className="text-gold-500 mb-2">{'★'.repeat(t.rating)}</div>
                <p className="text-sm text-gray-600 italic mb-3">&ldquo;{t.message}&rdquo;</p>
                <p className="font-semibold text-sm">{t.customerName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Kesyon Souvan Poze</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="card p-4">
                <summary className="font-medium cursor-pointer">{f.question}</summary>
                <p className="text-sm text-gray-600 mt-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="card p-8 text-center bg-brand-900 text-white rounded-2xl">
        <h2 className="text-xl font-bold mb-2">Abòne w nan Newsletter nou an</h2>
        <p className="text-sm text-gray-300 mb-4">Resevwa dènye ofri ak nouvo pwodwi dirèkteman nan bwat imel ou.</p>
        <form className="flex max-w-md mx-auto gap-2" action="/api/newsletter" method="post">
          <input
            type="email"
            name="email"
            required
            placeholder="Antre email ou"
            className="flex-1 px-4 py-2 rounded-lg text-black"
          />
          <button className="btn-primary">Abòne</button>
        </form>
      </section>
    </div>
  );
}
