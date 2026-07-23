'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  salesByDay: { date: string; total: number }[];
  topProducts: { name: string; quantity: number }[];
}

export default function DashboardCharts({ salesByDay, topProducts }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-5">
        <h2 className="font-bold mb-3">Lavant (30 Dènye Jou)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#3654f5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-3">Top 5 Pwodwi ki Pi Vann</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={12} />
            <YAxis type="category" dataKey="name" width={120} fontSize={11} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#e8b13a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
