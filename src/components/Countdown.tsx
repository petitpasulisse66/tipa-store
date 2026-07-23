'use client';

import { useEffect, useState } from 'react';

export default function Countdown({ endsAt }: { endsAt: string | Date }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(endsAt).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex gap-2 font-mono text-lg font-bold text-red-600">
      <span className="bg-red-50 px-2 py-1 rounded">{pad(timeLeft.h)}</span>:
      <span className="bg-red-50 px-2 py-1 rounded">{pad(timeLeft.m)}</span>:
      <span className="bg-red-50 px-2 py-1 rounded">{pad(timeLeft.s)}</span>
    </div>
  );
}
