import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: {
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    new?: string;
    bestSeller?: string;
    flashSale?: string;
  };
}

const PAGE_SIZE = 12;

export default async function ProductsPage({ searchParams }: Props) {
  const page = Number(searchParams.page || 1);

  const where: any = { isActive: true };
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }
  if (searchParams.category) where.category = { slug: searchParams.category };
  if (searchParams.new) where.isNew = true;
  if (searchParams.bestSeller) where.isBestSeller = true;
  if (searchParams.flashSale) where.isFlashSale = true;

  const orderBy: any =
    searchParams.sort === 'price_asc' ? { price: 'asc' } :
    searchParams.sort === 'price_desc' ? { price: 'desc' } :
    searchParams.sort === 'rating' ? { ratingAvg: 'desc' } :
    { createdAt: 'desc' };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { parentId: null } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid md:grid-cols-4 gap-6">
      {/* FILTÈ */}
      <aside className="card p-4 h-fit space-y-4">
        <h3 className="font-bold">Filtre</h3>
        <div>
          <p className="text-sm font-semibold mb-2">Kategori</p>
          <ul className="space-y-1 text-sm">
            <li><Link href="/products" className="hover:text-brand-600">Tout</Link></li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-brand-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* LIS PWODWI */}
      <div className="md:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{total} pwodwi jwenn</p>
          <form className="flex items-center gap-2 text-sm">
            <label>Triye:</label>
            <select
              name="sort"
              defaultValue={searchParams.sort || 'newest'}
              className="border rounded px-2 py-1"
              onChange={(e) => e.currentTarget.form?.submit()}
            >
              <option value="newest">Pi Resan</option>
              <option value="price_asc">Pri: Ba a Wo</option>
              <option value="price_desc">Pri: Wo a Ba</option>
              <option value="rating">Pi Byen Note</option>
            </select>
          </form>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">Pa gen pwodwi ki koresponn ak rechèch ou.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, price: Number(p.price), promoPrice: p.promoPrice ? Number(p.promoPrice) : null }}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/products?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                className={`px-3 py-1.5 rounded border text-sm ${p === page ? 'bg-brand-600 text-white' : ''}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
