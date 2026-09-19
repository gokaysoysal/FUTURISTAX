'use client';

import type { BurdenComponent, BurdenMonth } from '@/lib/charts/burden';
import { useChartColors } from '@/lib/charts/tokens';
import { formatCurrency } from '@/lib/format';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Vergi Yükü Panosu görsel katmanı (tembel yüklenir).
 *
 * - Renkler tema tokenlarından (`useChartColors`); grafik kendi rengini
 *   getirmez. Kategori serileri semantik olmayan tokenlar: accent, accent-glow,
 *   text-secondary (signal/positive ayrılmış anlamlara dokunulmaz).
 * - Grafikler `aria-hidden`: ekran okuyucu karşılığı panodaki sr-only tablodur.
 */

const compactTRY = (n: number) =>
  new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/** Recharts tooltip value tipi number|string|dizi|undefined olabilir. */
const toNumber = (value: unknown): number =>
  typeof value === 'number' ? value : Number(value) || 0;

export function TaxBurdenCharts({
  components,
  timeline,
}: {
  components: BurdenComponent[];
  timeline: BurdenMonth[];
}) {
  const c = useChartColors();
  const seriesColor: Record<BurdenComponent['key'], string> = {
    kv: c.accent,
    kdv: c.accentGlow,
    sgk: c.textSecondary,
  };

  return (
    // inert + aria-hidden: grafik tümüyle dekoratif; SR karşılığı sr-only tablo.
    // recharts iç <g>/<svg> odaklanabilir kalsa bile inert bunu etkisizleştirir.
    <div aria-hidden="true" inert className="grid gap-6 sm:grid-cols-2">
      <figure className="m-0">
        <figcaption className="basis-ref mb-2 block">Dağılım</figcaption>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer={false}>
              <Pie
                data={components}
                dataKey="annual"
                nameKey="label"
                innerRadius="58%"
                outerRadius="86%"
                paddingAngle={2}
                stroke={c.surface}
                strokeWidth={2}
                isAnimationActive={false}
                tabIndex={-1}
              >
                {components.map((item) => (
                  <Cell key={item.key} fill={seriesColor[item.key]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="m-0">
        <figcaption className="basis-ref mb-2 block">Yıl içi kümülatif (tahmini)</figcaption>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeline}
              accessibilityLayer={false}
              margin={{ top: 6, right: 6, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="burden-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fill: c.textSecondary, fontSize: 11 }}
                axisLine={{ stroke: c.grid }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                width={44}
                tick={{ fill: c.textSecondary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={compactTRY}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(toNumber(value)), 'Kümülatif']}
                labelFormatter={(label) => `${label} sonu`}
                contentStyle={{
                  background: c.surface,
                  border: `1px solid ${c.grid}`,
                  borderRadius: 8,
                  color: c.text,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={c.accent}
                strokeWidth={2}
                fill="url(#burden-fill)"
                isAnimationActive={false}
                tabIndex={-1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </div>
  );
}
