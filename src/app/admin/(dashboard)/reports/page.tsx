const REPORTS = [
  { type: 'sales', label: 'Rapò Lavant', icon: '💰' },
  { type: 'products', label: 'Rapò Pwodwi', icon: '📦' },
  { type: 'customers', label: 'Rapò Kliyan', icon: '👥' },
  { type: 'stock', label: 'Rapò Stock (ba)', icon: '⚠️' },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rapò</h1>
      <p className="text-sm text-gray-500">
        Ekspòte rapò yo an CSV (louvri fasil nan Excel) oswa gade yo dirèkteman.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.type} className="card p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl mb-1">{r.icon}</p>
              <p className="font-semibold">{r.label}</p>
            </div>
            <div className="flex gap-2">
              <a href={`/api/reports?type=${r.type}&format=json`} target="_blank" className="btn-secondary text-xs">
                Gade
              </a>
              <a href={`/api/reports?type=${r.type}&format=csv`} className="btn-primary text-xs">
                Telechaje CSV
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Nòt: Ekspòtasyon Excel (.xlsx) ak PDF ka ajoute pita ak yon librè tankou exceljs oswa pdfkit, si w bezwen fòma sa yo espesifikman.
      </p>
    </div>
  );
}
