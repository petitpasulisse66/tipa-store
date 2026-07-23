import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'An Atant',
  ACCEPTED: 'Aksepte',
  PROCESSING: 'Ap Prepare',
  DELIVERED: 'Livre',
  CANCELLED: 'Anile',
  REFUNDED: 'Ranbouse',
};

export default async function OrdersHistoryPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: currentUser.userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-xl font-bold mb-6">Kòmand Mwen</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">Ou poko fè okenn kòmand.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">#{o.orderNumber}</span>
                <span className="text-xs px-2 py-1 rounded bg-brand-50 text-brand-700 font-medium">
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{o.createdAt.toLocaleDateString('fr-HT')}</p>
              <ul className="text-sm text-gray-600 mb-3">
                {o.items.map((i) => (
                  <li key={i.id}>{i.name} × {i.quantity}</li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="font-bold">{formatCurrency(o.total)}</span>
                <a href={`/api/invoice/${o.id}`} className="text-brand-600 text-sm font-medium">
                  📄 Telechaje Fakti
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
