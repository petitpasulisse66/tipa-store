import { prisma } from '@/lib/prisma';
import DashboardCharts from '@/components/admin/DashboardCharts';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalOrders, totalCustomers, totalProducts, paidPayments, lowStock, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.payment.findMany({ where: { status: 'PAID' } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 8 }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });

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
  const chartData = Object.entries(salesByDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, total]) => ({ date: date.slice(5), total }));

  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ['name'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });
  const topProducts = topProductsRaw.map((p) => ({ name: p.name, quantity: p._sum.quantity || 0 }));

  const stats = [
    { label: 'Total Kòmand', value: totalOrders, icon: '🧾' },
    { label: 'Total Kliyan', value: totalCustomers, icon: '👥' },
    { label: 'Total Pwodwi', value: totalProducts, icon: '📦' },
    { label: 'Total Revni', value: formatCurrency(totalRevenue), icon: '💰' },
    { label: 'Kòmand An Atant', value: pendingOrders, icon: '⏳' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <DashboardCharts salesByDay={chartData} topProducts={topProducts} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-bold mb-3">Pwodwi ki Prèske Fini</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">Tout stock nan nòm.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-red-600 font-semibold">{p.stock} rete</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-3">Dènye Kòmand</h2>
          <ul className="space-y-2 text-sm">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between">
                <span>#{o.orderNumber}</span>
                <span>{o.status}</span>
                <span className="font-semibold">{formatCurrency(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
