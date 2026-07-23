import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET /api/products?search=&category=&sort=price_asc&page=1&limit=12&featured=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 12);
  const featured = searchParams.get('featured');
  const isNew = searchParams.get('new');
  const bestSeller = searchParams.get('bestSeller');
  const flashSale = searchParams.get('flashSale');

  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }
  if (category) where.category = { slug: category };
  if (featured) where.isFeatured = true;
  if (isNew) where.isNew = true;
  if (bestSeller) where.isBestSeller = true;
  if (flashSale) where.isFlashSale = true;

  const orderBy: any =
    sort === 'price_asc' ? { price: 'asc' } :
    sort === 'price_desc' ? { price: 'desc' } :
    sort === 'rating' ? { ratingAvg: 'desc' } :
    sort === 'name' ? { name: 'asc' } :
    { createdAt: 'desc' };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/products - kreye yon pwodwi (Admin sèlman)
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });
  }

  const body = await req.json();
  const required = ['name', 'sku', 'description', 'categoryId', 'price'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Chan '${field}' obligatwa` }, { status: 400 });
    }
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: slugify(body.name) + '-' + Math.random().toString(36).slice(2, 7),
      sku: body.sku,
      barcode: body.barcode,
      description: body.description,
      categoryId: body.categoryId,
      brand: body.brand,
      tags: body.tags || [],
      images: body.images || [],
      videoUrl: body.videoUrl,
      price: body.price,
      promoPrice: body.promoPrice,
      stock: body.stock ?? 0,
      colors: body.colors || [],
      sizes: body.sizes || [],
      weight: body.weight,
      isFeatured: !!body.isFeatured,
      isNew: !!body.isNew,
      isBestSeller: !!body.isBestSeller,
      isFlashSale: !!body.isFlashSale,
      flashSaleEnds: body.flashSaleEnds ? new Date(body.flashSaleEnds) : null,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
