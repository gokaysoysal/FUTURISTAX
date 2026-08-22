import type { ExchangeRateTable } from '@futuristax/tax-engine';

/**
 * TCMB günlük döviz kuru beslemesi.
 *
 * Eski sitede kurlar ücretsiz bir üçüncü taraf API'sinden, altın fiyatı ise
 * CoinGecko üzerinden `tether-gold` kripto tokeninden türetiliyordu. Bir mali
 * müşavirlik sitesinde kur kaynağı resmî olmalıdır: TCMB'nin kendi XML servisi.
 *
 * Veri sunucuda çekilir ve cache'lenir; istemci hiçbir dış servise bağlanmaz.
 * (CSP'deki connect-src bunu zaten engelliyor.)
 */

const TCMB_TODAY = 'https://www.tcmb.gov.tr/kurlar/today.xml';

/** Sitede gösterilecek para birimleri */
const TRACKED = ['USD', 'EUR', 'GBP', 'CHF'] as const;

export class RateFetchError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'RateFetchError';
  }
}

/**
 * TCMB XML'inden döviz satış kurlarını ayrıştırır.
 *
 * Basit regex kullanılıyor: belge şeması sabit ve küçük, tam bir XML ayrıştırıcı
 * bağımlılığı eklemeye değmez. Şema değişirse test kırılır.
 */
export function parseTcmbXml(xml: string): ExchangeRateTable {
  const dateMatch = xml.match(/Tarih="(\d{2})\.(\d{2})\.(\d{4})"/);
  if (!dateMatch) throw new RateFetchError('TCMB yanıtında tarih bulunamadı.');
  const [, day, month, year] = dateMatch;
  const asOf = `${year}-${month}-${day}`;

  const tryPerUnit: Record<string, number> = {};

  for (const code of TRACKED) {
    const block = xml.match(new RegExp(`<Currency[^>]*CurrencyCode="${code}"[\\s\\S]*?</Currency>`));
    if (!block) continue;

    const unitMatch = block[0].match(/<Unit>(\d+)<\/Unit>/);
    const sellMatch = block[0].match(/<ForexSelling>([\d.]+)<\/ForexSelling>/);
    if (!sellMatch?.[1]) continue;

    const unit = Number(unitMatch?.[1] ?? 1);
    const selling = Number(sellMatch[1]);
    if (!Number.isFinite(selling) || unit <= 0) continue;

    tryPerUnit[code] = selling / unit;
  }

  if (Object.keys(tryPerUnit).length === 0) {
    throw new RateFetchError('TCMB yanıtında kullanılabilir kur bulunamadı.');
  }

  return { tryPerUnit, asOf, source: 'TCMB' };
}

/**
 * Güncel kur tablosunu getirir.
 *
 * ÖNEMLİ: Kaynak erişilemezse uydurma değer ÜRETİLMEZ. Çağıran taraf hatayı
 * yakalar ve kullanıcıya "kur şu an güncellenemiyor" durumu gösterir.
 */
export async function fetchTcmbRates(): Promise<ExchangeRateTable> {
  let response: Response;
  try {
    response = await fetch(TCMB_TODAY, {
      // Kur günde bir kez, saat 15:30 civarında yayımlanır.
      next: { revalidate: 3600, tags: ['fx-rates'] },
      headers: { Accept: 'application/xml' },
    });
  } catch (error) {
    throw new RateFetchError('TCMB kur servisine ulaşılamadı.', error);
  }

  if (!response.ok) {
    throw new RateFetchError(`TCMB kur servisi ${response.status} döndü.`);
  }

  return parseTcmbXml(await response.text());
}
