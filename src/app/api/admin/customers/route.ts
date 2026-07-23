import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

// GET /api/admin/customers - fich kliyan otomatik ak total kòmand/achte
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;

  const customers = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER',
      ...(search
        ? { OR: [{ fullName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
        : {}),
    },
    include: {
      orders: { select: { total: true, createdAt: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const enriched = customers.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    whatsapp: c.whatsapp,
    createdAt: c.createdAt,
    isActive: c.isActive,
    totalOrders: c.orders.length,
    totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
    lastOrderAt: c.orders[0]?.createdAt || null,
  }));

  return NextResponse.json({ customers: enriched });
}
