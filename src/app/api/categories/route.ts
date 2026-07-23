import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { children: true, _count: { select: { products: true } } },
    where: { parentId: null },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Non kategori a obligatwa' }, { status: 400 });

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: slugify(body.name),
      icon: body.icon,
      bannerImage: body.bannerImage,
      parentId: body.parentId || null,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
