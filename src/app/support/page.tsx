import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const faqs = await prisma.faqItem.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } });

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <h1 className="text-2xl font-bold">Sant Sipò</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <a href="/contact" className="card p-5 text-center hover:shadow-md">
          <p className="text-3xl mb-2">🎫</p>
          <p className="font-semibold">Kreye yon Ticket</p>
        </a>
        <a href="https://wa.me/50900000000" target="_blank" rel="noreferrer" className="card p-5 text-center hover:shadow-md">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-semibold">WhatsApp Sipò</p>
        </a>
        <div className="card p-5 text-center opacity-60">
          <p className="text-3xl mb-2">🗨️</p>
          <p className="font-semibold">Live Chat (byento)</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Kesyon Souvan Poze</h2>
        {faqs.length === 0 ? (
          <p className="text-gray-500 text-sm">Poko gen FAQ konfigire nan CMS la.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="card p-4">
                <summary className="font-medium cursor-pointer">{f.question}</summary>
                <p className="text-sm text-gray-600 mt-2">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
