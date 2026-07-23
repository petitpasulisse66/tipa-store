import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) redirect('/login');

  const items = await prisma.wishlistItem.findMany({
    where: { userId: currentUser.userId },
    include: { product: true },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-xl font-bold mb-6">Wishlist Mwen</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Ou poko ajoute okenn pwodwi nan wishlist ou.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((i) => (
            <ProductCard
              key={i.id}
              product={{
                ...i.product,
                price: Number(i.product.price),
                promoPrice: i.product.promoPrice ? Number(i.product.promoPrice) : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
