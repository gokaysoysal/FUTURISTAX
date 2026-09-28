/**
 * Vergi Takvimi — sitenin imza bileşeninin veri katmanı.
 *
 * Yükümlülükler tekrar eden kurallar olarak tanımlanır; somut tarihler
 * bunlardan türetilir. Böylece her yıl elle tarih girilmesi gerekmez.
 *
 * VUK Md. 18 kaydırması UYGULANIR: kanuni son gün hafta sonu veya resmî tatile
 * denk gelirse, gösterilen `date` takip eden ilk iş günüdür. Ham kanuni tarih
 * `statutoryDate` alanında korunur (bkz. `./holidays`).
 *
 * Mali tatil (1–20 Temmuz, 5604): kesin +7 gün kuralı modellenmedi; bu aralığa
 * denk gelen son tarihler kaydırılmaz, `fiscalBreakCaution` ile işaretlenir.
 * Dinî bayram tatilleri: tarih verisi doğrulanana kadar hesaba katılmaz
 * (`RELIGIOUS_HOLIDAYS_BY_YEAR`), takvim bunu kullanıcıya bildirir.
 */

import { inFiscalBreak, shiftToNextBusinessDay } from './holidays';

export type TaxpayerType = 'corporate' | 'soleTrader' | 'employer' | 'all';
export type Frequency = 'monthly' | 'quarterly' | 'annual';

export interface ObligationRule {
  id: string;
  title: string;
  description: string;
  taxpayerTypes: TaxpayerType[];
  frequency: Frequency;
  /** Ayın kaçıncı günü son gün */
  dayOfMonth: number;
  /**
   * Hangi aylarda geçerli (1–12). `monthly` için tüm aylar.
   * `quarterly` ve `annual` için ilgili aylar.
   */
  months: number[];
  /** Yasal dayanak */
  basis: string;
}

export const OBLIGATION_RULES: readonly ObligationRule[] = [
  {
    id: 'kdv-beyan',
    title: 'KDV beyannamesi',
    description: 'Bir önceki aya ait katma değer vergisi beyanı ve ödemesi.',
    taxpayerTypes: ['corporate', 'soleTrader'],
    frequency: 'monthly',
    dayOfMonth: 28,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basis: 'KDVK Md. 41',
  },
  {
    id: 'muhtasar-prim',
    title: 'Muhtasar ve prim hizmet beyannamesi',
    description: 'Stopaj ve SGK bildirimlerinin birleşik beyanı.',
    taxpayerTypes: ['employer'],
    frequency: 'monthly',
    dayOfMonth: 26,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basis: 'GVK Md. 98/A',
  },
  {
    id: 'gecici-vergi',
    title: 'Geçici vergi beyannamesi',
    description: 'Üçer aylık kazançlar üzerinden geçici vergi beyanı.',
    taxpayerTypes: ['corporate', 'soleTrader'],
    frequency: 'quarterly',
    dayOfMonth: 17,
    months: [2, 5, 8, 11],
    basis: 'KVK Md. 32, GVK Mük. Md. 120',
  },
  {
    id: 'kurumlar-vergisi',
    title: 'Kurumlar vergisi beyannamesi',
    description: 'Takvim yılı esasına tabi kurumlar için yıllık beyan.',
    taxpayerTypes: ['corporate'],
    frequency: 'annual',
    dayOfMonth: 25,
    months: [4],
    basis: 'KVK Md. 14',
  },
  {
    id: 'gelir-vergisi',
    title: 'Yıllık gelir vergisi beyannamesi',
    description: 'Gerçek kişilerin yıllık gelir beyanı.',
    taxpayerTypes: ['soleTrader'],
    frequency: 'annual',
    dayOfMonth: 31,
    months: [3],
    basis: 'GVK Md. 92',
  },
  {
    id: 'edefter-berat',
    title: 'e-Defter berat yüklemesi',
    description: 'Aylık e-Defter beratlarının GİB sistemine yüklenmesi.',
    taxpayerTypes: ['corporate', 'soleTrader'],
    frequency: 'monthly',
    dayOfMonth: 31,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basis: '1 Sıra No.lu e-Defter Genel Tebliği',
  },
  {
    id: 'ba-bs',
    title: 'Ba-Bs formları',
    description: 'Mal ve hizmet alım-satım bildirim formları.',
    taxpayerTypes: ['corporate', 'soleTrader'],
    frequency: 'monthly',
    dayOfMonth: 30,
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basis: '396 Sıra No.lu VUK Genel Tebliği',
  },
];

export interface Deadline {
  ruleId: string;
  title: string;
  description: string;
  basis: string;
  /**
   * Etkin son gün, ISO 8601 (YYYY-MM-DD). VUK Md. 18 kaydırması uygulanmıştır:
   * hafta sonu/resmî tatile denk gelen kanuni tarih ilk iş gününe uzatılmıştır.
   */
  date: string;
  /** Kaydırma öncesi ham kanuni tarih, ISO 8601. */
  statutoryDate: string;
  /** `date`, `statutoryDate`'ten farklı mı? */
  shifted: boolean;
  /** Kaydırma sebebi: "hafta sonu" | "resmî tatil: Zafer Bayramı" vb. */
  shiftReason?: string;
  /**
   * Etkin son gün 1–20 Temmuz mali tatiline denk geliyor. Süre 5604 sayılı
   * Kanun uyarınca ayrıca uzayabilir; bu motor kesin tarihi hesaplamaz.
   */
  fiscalBreakCaution: boolean;
  taxpayerTypes: TaxpayerType[];
  /** Referans tarihe göre etkin son güne kalan gün. Geçmişse negatif. */
  daysRemaining: number;
  /** Aciliyet — UI'da damga kırmızısı bu bayrağa bakar */
  urgency: 'past' | 'imminent' | 'soon' | 'upcoming';
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function toIsoDate(year: number, month: number, day: number): string {
  const capped = Math.min(day, lastDayOfMonth(year, month));
  return `${year}-${String(month).padStart(2, '0')}-${String(capped).padStart(2, '0')}`;
}

function daysBetween(fromIso: string, toIso: string): number {
  const MS_PER_DAY = 86_400_000;
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((b - a) / MS_PER_DAY);
}

function classifyUrgency(daysRemaining: number): Deadline['urgency'] {
  if (daysRemaining < 0) return 'past';
  if (daysRemaining <= 3) return 'imminent';
  if (daysRemaining <= 10) return 'soon';
  return 'upcoming';
}

export interface DeadlineQuery {
  /** Referans tarih, ISO 8601 (YYYY-MM-DD). Çağıran taraf verir — motor saat okumaz. */
  referenceDate: string;
  /** Kaç gün ileriye bakılacak */
  horizonDays?: number;
  taxpayerType?: TaxpayerType;
}

/**
 * Verilen referans tarihten itibaren yaklaşan yükümlülükleri döndürür.
 * Tarih okuma sorumluluğu çağırana aittir — bu sayede fonksiyon deterministiktir.
 */
export function getUpcomingDeadlines(query: DeadlineQuery): Deadline[] {
  const horizon = query.horizonDays ?? 90;
  const [refYear, refMonth] = query.referenceDate.split('-').map(Number);
  if (!refYear || !refMonth) throw new Error(`Geçersiz referans tarih: ${query.referenceDate}`);

  const deadlines: Deadline[] = [];

  // Referans ayından başlayarak ufku kapsayacak kadar ay ilerle
  const monthsToScan = Math.ceil(horizon / 28) + 1;

  for (let offset = 0; offset <= monthsToScan; offset++) {
    const cursor = new Date(Date.UTC(refYear, refMonth - 1 + offset, 1));
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;

    for (const rule of OBLIGATION_RULES) {
      if (!rule.months.includes(month)) continue;
      if (
        query.taxpayerType &&
        query.taxpayerType !== 'all' &&
        !rule.taxpayerTypes.includes(query.taxpayerType)
      ) {
        continue;
      }

      const statutoryDate = toIsoDate(year, month, rule.dayOfMonth);
      const shift = shiftToNextBusinessDay(statutoryDate);
      const date = shift.date;

      // Filtre ETKİN tarihe göre: kanuni tarihi ufuk içindeyken kaydırma
      // sonucu ufkun dışına taşan bir yükümlülük gösterilmez.
      const daysRemaining = daysBetween(query.referenceDate, date);
      if (daysRemaining < 0 || daysRemaining > horizon) continue;

      deadlines.push({
        ruleId: rule.id,
        title: rule.title,
        description: rule.description,
        basis: rule.basis,
        date,
        statutoryDate,
        shifted: shift.shifted,
        shiftReason: shift.reason,
        fiscalBreakCaution: inFiscalBreak(date),
        taxpayerTypes: rule.taxpayerTypes,
        daysRemaining,
        urgency: classifyUrgency(daysRemaining),
      });
    }
  }

  return deadlines.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

/**
 * Yaklaşan yükümlülükleri iCalendar (.ics) biçiminde üretir.
 * Kullanıcı takvimine abone olabilsin diye — imza bileşeninin ayırt edici parçası.
 */
export function buildIcsFeed(deadlines: readonly Deadline[], calendarName: string): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FuturistaX Advisory//Vergi Takvimi//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Europe/Istanbul',
  ];

  for (const d of deadlines) {
    const compact = d.date.replace(/-/g, '');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${d.ruleId}-${compact}@futuristax.com`,
      `DTSTART;VALUE=DATE:${compact}`,
      `SUMMARY:${d.title}`,
      `DESCRIPTION:${d.description} (${d.basis})`,
      'BEGIN:VALARM',
      'TRIGGER:-P3D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${d.title} için son 3 gün`,
      'END:VALARM',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
