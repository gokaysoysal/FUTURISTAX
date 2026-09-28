'use client';

import { BURDEN_FIELDS, type BurdenInput } from '@/lib/charts/burden';
import { formatCurrency } from '@/lib/format';

type Values = Omit<BurdenInput, 'year'>;

/**
 * Pano girdileri (range + sayısal) — Vergi Yükü Panosu ve Yıl Karşılaştırma
 * ortak kullanır. Tümü native kontrol; klavyeyle tam çalışır.
 */
export function BurdenFields({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string;
  values: Values;
  onChange: (key: keyof Values, value: number) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {BURDEN_FIELDS.map((field) => {
        const id = `${idPrefix}-${field.key}`;
        const value = values[field.key];
        return (
          <div key={field.key}>
            <label
              htmlFor={id}
              className="flex items-baseline justify-between gap-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
            >
              <span>{field.label}</span>
              <span data-numeric className="text-[var(--color-text)]">
                {field.money ? formatCurrency(value) : value}
              </span>
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id={id}
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={value}
                onChange={(event) => onChange(field.key, event.target.valueAsNumber)}
                className="h-1 flex-1 accent-[var(--color-accent)]"
              />
              <input
                type="number"
                inputMode="numeric"
                min={field.min}
                max={field.max}
                step={field.step}
                value={value}
                onChange={(event) => onChange(field.key, event.target.valueAsNumber)}
                aria-label={`${field.label} (sayısal giriş)`}
                data-numeric
                className="w-28 border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-right text-[length:var(--text-sm)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
