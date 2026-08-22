/**
 * Kur çevirimi.
 *
 * Kur verisi bu pakete DIŞARIDAN verilir — motor ağ erişimi yapmaz.
 * Uygulama katmanı TCMB'nin günlük XML beslemesinden okuyup buraya aktarır.
 */

export interface ExchangeRateTable {
  /** 1 birim yabancı para = kaç TRY */
  tryPerUnit: Readonly<Record<string, number>>;
  /** Kurun ait olduğu tarih, ISO 8601 */
  asOf: string;
  source: 'TCMB';
}

export interface CurrencyConversionInput {
  amount: number;
  from: string;
  to: string;
}

export interface CurrencyConversionResult {
  amount: number;
  rate: number;
  from: string;
  to: string;
  asOf: string;
}

function toTry(amount: number, code: string, table: ExchangeRateTable): number {
  if (code === 'TRY') return amount;
  const rate = table.tryPerUnit[code];
  if (rate === undefined) throw new Error(`Kur bulunamadı: ${code}`);
  return amount * rate;
}

export function convertCurrency(
  input: CurrencyConversionInput,
  table: ExchangeRateTable,
): CurrencyConversionResult {
  const amountInTry = toTry(input.amount, input.from, table);

  let converted: number;
  if (input.to === 'TRY') {
    converted = amountInTry;
  } else {
    const targetRate = table.tryPerUnit[input.to];
    if (targetRate === undefined) throw new Error(`Kur bulunamadı: ${input.to}`);
    converted = amountInTry / targetRate;
  }

  const unitInTry = toTry(1, input.from, table);
  const targetUnitInTry = input.to === 'TRY' ? 1 : (table.tryPerUnit[input.to] ?? 1);

  return {
    amount: converted,
    rate: unitInTry / targetUnitInTry,
    from: input.from,
    to: input.to,
    asOf: table.asOf,
  };
}
