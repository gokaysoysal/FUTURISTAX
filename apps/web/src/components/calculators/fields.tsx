'use client';

import { SUPPORTED_YEARS, type TaxYear } from '@futuristax/tax-engine';

/**
 * Hesaplayıcı form alanları — tek yerde tanımlı, tüm hesaplayıcılarda aynı.
 *
 * Neden: sekiz hesaplayıcının her biri kendi <label>/<input> işaretlemesini
 * tekrarlarsa erişilebilirlik ve görsel dil sürüklenir. Etiket-alan bağı
 * (htmlFor + id, aria-describedby) burada bir kez doğru kurulur.
 */

const FIELD_CLASS =
  'w-full border border-[var(--color-rule)] bg-[var(--color-sunken)] px-3 py-2.5 ' +
  'text-[length:var(--text-sm)] text-[var(--color-text)] ' +
  'focus:border-[var(--color-ink)] focus:outline-none';

/** Türkçe ondalık ("1234,56") ve düz sayı girişini güvenle sayıya çevirir. */
export function parseNumeric(raw: string): number {
  const n = Number.parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  help,
  inputMode = 'decimal',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  inputMode?: 'decimal' | 'numeric' | 'text';
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        data-numeric
        className={FIELD_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={help ? `${id}-help` : undefined}
      />
      {help ? (
        <p
          id={`${id}-help`}
          className="mt-1.5 text-[length:var(--text-xs)] text-[var(--color-text-muted)]"
        >
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
      >
        {label}
      </label>
      <select
        id={id}
        className={FIELD_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function YearSelect({
  value,
  onChange,
}: {
  value: TaxYear;
  onChange: (year: TaxYear) => void;
}) {
  return (
    <SelectField
      id="tax-year"
      label="Vergi yılı"
      value={String(value)}
      onChange={(v) => onChange(Number(v) as TaxYear)}
      options={SUPPORTED_YEARS.map((year) => ({ value: String(year), label: String(year) }))}
    />
  );
}
