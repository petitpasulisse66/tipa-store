import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const [
    totalOrders,
    totalCustomers,
    totalProducts,
    paidPayments,
    lowStockProducts,
    recentOrders,
    newCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.payment.findMany({ where: { status: 'PAID' } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 10 }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { items: true } }),
    prisma.user.findMany({ where: { role: 'CUSTOMER' }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Lavant pa jou pou 30 dènye jou yo (pou grafik)
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const recentPaidOrders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, payment: { status: 'PAID' } },
    select: { total: true, createdAt: true },
  });

  const salesByDay: Record<string, number> = {};
  for (const o of recentPaidOrders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    salesByDay[key] = (salesByDay[key] || 0) + Number(o.total);
  }

  // Top pwodwi vann yo
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ['productId', 'name'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  return NextResponse.json({
    stats: {
      totalOrders,
      totalCustomers,
      totalProducts,
      totalRevenue,
      pendingOrders: recentOrders.filter((o) => o.status === 'PENDING').length,
    },
    lowStockProducts,
    recentOrders,
    newCustomers,
    salesByDay: Object.entries(salesByDay).map(([date, total]) => ({ date, total })),
    topProducts: topProductsRaw.map((p) => ({ name: p.name, quantity: p._sum.quantity })),
  });
}
