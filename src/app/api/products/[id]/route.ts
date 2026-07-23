import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// GET /api/products/:id - detay pwodwi (ansanm ak review ak pwodwi ki sanble)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      category: true,
      reviews: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Pwodwi pa jwenn' }, { status: 404 });
  }

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 4,
  });

  return NextResponse.json({ product, related });
}

// PUT /api/products/:id - modifye pwodwi (Admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ product });
}

// DELETE /api/products/:id (Admin)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
