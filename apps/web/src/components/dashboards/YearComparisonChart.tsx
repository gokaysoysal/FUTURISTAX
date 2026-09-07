'use client';

import { useChartColors } from '@/lib/charts/tokens';
import { formatCurrency } from '@/lib/format';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/** Yıl karşılaştırma görsel katmanı (tembel). aria-hidden — SR karşılığı tablo. */

const compactTRY = (n: number) =>
  new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const toNumber = (value: unknown): number =>
  typeof value === 'number' ? value : Number(value) || 0;

export type YearBar = { year: string; kv: number; kdv: number; sgk: number };

export function YearComparisonChart({ data }: { data: YearBar[] }) {
  const c = useChartColors();
  const series: { key: keyof Omit<YearBar, 'year'>; name: string; color: string }[] = [
    { key: 'kv', name: 'Kurumlar vergisi', color: c.accent },
    { key: 'kdv', name: 'Hesaplanan KDV (brüt)', color: c.accentGlow },
    { key: 'sgk', name: 'SGK işveren payı', color: c.textSecondary },
  ];

  return (
    <div aria-hidden="true" className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: c.textSecondary, fontSize: 12 }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis
            width={48}
            tick={{ fill: c.textSecondary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={compactTRY}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(toNumber(value)), String(name ?? '')]}
            contentStyle={{
              background: c.surface,
              border: `1px solid ${c.grid}`,
              borderRadius: 8,
              color: c.text,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: c.textSecondary }} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
