import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) redirect('/login');

  const addresses = await prisma.address.findMany({ where: { userId: currentUser.userId } });

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-xl font-bold mb-6">Adrès Livrezon</h1>
      {addresses.length === 0 ? (
        <p className="text-gray-500">Ou poko anrejistre okenn adrès. Adrès yo anrejistre otomatikman lè w fè yon kòmand.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="card p-4">
              <p className="font-semibold">{a.fullName} {a.isDefault && <span className="text-xs text-brand-600">(Prensipal)</span>}</p>
              <p className="text-sm text-gray-600">{a.address}, {a.city}, {a.department}</p>
              <p className="text-sm text-gray-500">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
