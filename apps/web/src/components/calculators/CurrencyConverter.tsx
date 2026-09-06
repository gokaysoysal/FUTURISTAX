'use client';

import { formatIsoDate } from '@/lib/format';
import { site } from '@futuristax/config';
import { type ExchangeRateTable, convertCurrency } from '@futuristax/tax-engine';
import { useEffect, useMemo, useState } from 'react';
import { SelectField, TextField, parseNumeric } from './fields';

/**
 * Kur çevirici — kur verisi /api/rates üzerinden TCMB'nin günlük XML
 * beslemesinden gelir. Servis erişilemezse "güncellenemiyor" gösterilir;
 * UYDURMA KUR ÜRETİLMEZ (birinci kural).
 */
type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; table: ExchangeRateTable };

export function CurrencyConverter() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TRY');

  useEffect(() => {
    let alive = true;
    fetch('/api/rates')
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!alive) return;
        if (response.ok && body?.ok && body.data) {
          setState({ status: 'ready', table: body.data as ExchangeRateTable });
        } else {
          setState({ status: 'error' });
        }
      })
      .catch(() => {
        if (alive) setState({ status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, []);

  const currencyOptions = useMemo(() => {
    const codes =
      state.status === 'ready' ? ['TRY', ...Object.keys(state.table.tryPerUnit)] : ['TRY'];
    return codes.map((code) => ({ value: code, label: code }));
  }, [state]);

  const conversion = useMemo(() => {
    if (state.status !== 'ready') return null;
    try {
      return convertCurrency({ amount: parseNumeric(amount), from, to }, state.table);
    } catch {
      return null;
    }
  }, [state, amount, from, to]);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <TextField id="fx-amount" label="Tutar" value={amount} onChange={setAmount} />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="fx-from"
            label="Kaynak para birimi"
            value={from}
            onChange={setFrom}
            options={currencyOptions}
          />
          <SelectField
            id="fx-to"
            label="Hedef para birimi"
            value={to}
            onChange={setTo}
            options={currencyOptions}
          />
        </div>
      </div>

      <div aria-live="polite">
        {state.status === 'loading' ? (
          <p className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            Güncel kurlar yükleniyor…
          </p>
        ) : null}

        {state.status === 'error' ? (
          <p
            role="note"
            className="border-l-2 border-[var(--color-stamp)] bg-[var(--color-stamp-soft)] p-5 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
          >
            <strong className="text-[var(--color-stamp)]">Kur verisi şu an güncellenemiyor.</strong>{' '}
            TCMB kur servisine ulaşılamadı. Uydurma bir kur göstermek yerine sonucu gizliyoruz;
            lütfen daha sonra tekrar deneyin.
          </p>
        ) : null}

        {state.status === 'ready' && conversion ? (
          <div className="border border-[var(--color-rule)] bg-[var(--color-surface)]">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-rule)] px-5 py-4">
              <span className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-text-secondary)]">
                {to} karşılığı
              </span>
              <span
                data-numeric
                className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] text-[var(--color-text)]"
              >
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: to,
                  maximumFractionDigits: 2,
                }).format(conversion.amount)}
              </span>
            </div>
            <dl className="divide-y divide-[var(--color-rule)]">
              <div className="flex justify-between px-5 py-2.5 text-[length:var(--text-sm)]">
                <dt className="text-[var(--color-text-secondary)]">Uygulanan kur</dt>
                <dd data-numeric className="text-[var(--color-text)]">
                  1 {from} ={' '}
                  {new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 4 }).format(
                    conversion.rate,
                  )}{' '}
                  {to}
                </dd>
              </div>
              <div className="flex justify-between px-5 py-2.5 text-[length:var(--text-sm)]">
                <dt className="text-[var(--color-text-secondary)]">Kur tarihi</dt>
                <dd data-numeric className="text-[var(--color-text)]">
                  {formatIsoDate(conversion.asOf)}
                </dd>
              </div>
              <div className="flex justify-between px-5 py-2.5 text-[length:var(--text-sm)]">
                <dt className="text-[var(--color-text-secondary)]">Kaynak</dt>
                <dd className="text-[var(--color-text)]">TCMB döviz satış kuru</dd>
              </div>
            </dl>
            <p className="border-t border-[var(--color-rule)] px-5 py-4 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
              {site.disclaimers.calculator.tr}
            </p>
          </div>
        ) : null}

        {state.status === 'ready' && !conversion ? (
          <p className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            Seçilen para birimi için kur bulunamadı.
          </p>
        ) : null}
      </div>
    </div>
  );
}
