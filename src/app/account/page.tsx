import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    include: { addresses: true, orders: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });

  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="card p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500 text-sm">{user.email} · {user.phone}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/account/orders" className="card p-5 text-center hover:shadow-md">
          <p className="text-2xl mb-1">📦</p>
          <p className="font-semibold">Kòmand Mwen</p>
        </Link>
        <Link href="/account/wishlist" className="card p-5 text-center hover:shadow-md">
          <p className="text-2xl mb-1">♡</p>
          <p className="font-semibold">Wishlist</p>
        </Link>
        <Link href="/account/addresses" className="card p-5 text-center hover:shadow-md">
          <p className="text-2xl mb-1">📍</p>
          <p className="font-semibold">Adrès Livrezon</p>
        </Link>
      </div>

      <div>
        <h2 className="font-bold mb-3">Dènye Kòmand</h2>
        {user.orders.length === 0 ? (
          <p className="text-gray-500 text-sm">Ou poko fè okenn kòmand.</p>
        ) : (
          <div className="space-y-2">
            {user.orders.map((o) => (
              <div key={o.id} className="card p-4 flex justify-between items-center text-sm">
                <span>#{o.orderNumber}</span>
                <span>{o.status}</span>
                <span className="font-semibold">{Number(o.total).toFixed(2)} HTG</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
