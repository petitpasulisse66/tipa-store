import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }], isActive: true },
    include: {
      reviews: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.metaTitle || `${product.name} - Tipa Store`,
    description: product.metaDesc || product.description.slice(0, 150),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <ProductDetailClient
        product={{
          ...product,
          price: Number(product.price),
          promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
        }}
      />

      {/* REVIEWS */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Avi Kliyan ({product.reviews.length})</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">Poko gen avi pou pwodwi sa a.</p>
        ) : (
          <div className="space-y-3">
            {product.reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">{r.user.fullName}</span>
                  <span className="text-gold-500 text-sm">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PWODWI KI SANBLE */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Pwodwi ki Sanble</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
