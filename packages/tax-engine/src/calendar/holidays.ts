/**
 * Türkiye resmî tatil tablosu — vergi takvimi kaydırması için.
 *
 * VUK Md. 18: beyan/ödeme süresinin son günü resmî tatile veya hafta sonuna
 * denk gelirse süre, takip eden ilk iş gününün mesai bitimine uzar.
 *
 * Bu dosya SAF veridir + saf yardımcılardır. Tarih okumaz, ağ erişmez.
 */

export interface FixedHoliday {
  /** 1–12 */
  month: number;
  /** Ayın günü */
  day: number;
  name: string;
  /**
   * Yarım gün tatil (örn. 28 Ekim öğleden sonra). Kaydırma açısından TAM tatil
   * kabul edilir: o gün mesai öğlen bittiği için beyan pratikte verilemez ve
   * ertesi gün (29 Ekim) zaten tam tatildir.
   */
  halfDay?: boolean;
}

/**
 * Sabit tarihli ulusal bayram ve genel tatiller.
 * Dayanak: 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun.
 */
export const FIXED_HOLIDAYS: readonly FixedHoliday[] = [
  { month: 1, day: 1, name: 'Yılbaşı' },
  { month: 4, day: 23, name: 'Ulusal Egemenlik ve Çocuk Bayramı' },
  { month: 5, day: 1, name: 'Emek ve Dayanışma Günü' },
  { month: 5, day: 19, name: 'Atatürk’ü Anma, Gençlik ve Spor Bayramı' },
  { month: 7, day: 15, name: 'Demokrasi ve Millî Birlik Günü' },
  { month: 8, day: 30, name: 'Zafer Bayramı' },
  { month: 10, day: 28, name: 'Cumhuriyet Bayramı arifesi', halfDay: true },
  { month: 10, day: 29, name: 'Cumhuriyet Bayramı' },
];

/**
 * Mali tatil — 5604 sayılı Kanun. Her yıl 1–20 Temmuz.
 *
 * NOT: 5604, süreyi "takip eden ilk iş günü"ne değil, mali tatilin son gününü
 * izleyen 7. günün mesai bitimine uzatır ve bazı yükümlülükleri kapsam dışı
 * bırakır. Bu KESİN +7 gün kuralı burada MODELLENMEDİ — yanlış bir "kesin"
 * tarih üretmemek için, mali tatile denk gelen son tarihler kaydırılmaz,
 * yalnızca `fiscalBreakCaution` bayrağıyla işaretlenir ve kullanıcı uyarılır.
 */
export const FISCAL_BREAK = { month: 7, fromDay: 1, toDay: 20 } as const;

export interface DateRange {
  /** ISO YYYY-MM-DD (dahil) */
  from: string;
  /** ISO YYYY-MM-DD (dahil) */
  to: string;
  name: string;
}

/**
 * DİNÎ BAYRAM TATİLLERİ — yıla göre değişir (hicrî/lunar takvim).
 *
 * ⚠️ TODO(firma / resmî kaynak): Ramazan ve Kurban Bayramı tatil günleri
 * Resmî Gazete / Diyanet duyurusundan DOĞRULANARAK girilmelidir. Bu proje
 * uydurma resmî tarih üretmez (birinci kural). Tarihler girilene kadar dinî
 * bayramlar kaydırma hesabına KATILMAZ ve takvim bunu kullanıcıya bildirir.
 *
 *   null → o yıl için veri henüz girilmedi (kaydırmada yok sayılır, uyarı gösterilir)
 *   []   → o yıl için "girildi ve dinî tatil tanımlı değil" (kullanılmaz, teorik)
 *
 * Beklenen biçim (doğrulandığında):
 *   2026: [
 *     { from: '2026-03-20', to: '2026-03-22', name: 'Ramazan Bayramı' },
 *     { from: '2026-05-27', to: '2026-05-30', name: 'Kurban Bayramı' },
 *   ]
 */
export const RELIGIOUS_HOLIDAYS_BY_YEAR: Record<number, readonly DateRange[] | null> = {
  2024: null, // TODO: Ramazan B. + Kurban B. 2024 — Resmî Gazete'den doğrula
  2025: null, // TODO: Ramazan B. + Kurban B. 2025 — Resmî Gazete'den doğrula
  2026: null, // TODO: Ramazan B. + Kurban B. 2026 — Resmî Gazete'den doğrula
};

/** İlgili yıl için dinî bayram verisi girilmiş mi? */
export function religiousHolidaysKnown(year: number): boolean {
  return RELIGIOUS_HOLIDAYS_BY_YEAR[year] != null;
}

function splitIso(iso: string): [number, number, number] {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) throw new Error(`Geçersiz ISO tarih: ${iso}`);
  return [y, m, d];
}

/** ISO tarihin hafta sonuna denk gelip gelmediği (UTC, cumartesi/pazar). */
export function isWeekend(iso: string): boolean {
  const [y, m, d] = splitIso(iso);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 0 || day === 6;
}

export interface HolidayHit {
  holiday: boolean;
  name?: string;
}

/** ISO tarih resmî tatil mi (sabit + doğrulanmışsa dinî bayram). */
export function publicHoliday(iso: string): HolidayHit {
  const [y, m, d] = splitIso(iso);

  for (const h of FIXED_HOLIDAYS) {
    if (h.month === m && h.day === d) return { holiday: true, name: h.name };
  }

  const ranges = RELIGIOUS_HOLIDAYS_BY_YEAR[y];
  if (ranges) {
    for (const r of ranges) {
      if (iso >= r.from && iso <= r.to) return { holiday: true, name: r.name };
    }
  }

  return { holiday: false };
}

/** ISO tarih mali tatil aralığında mı (1–20 Temmuz). */
export function inFiscalBreak(iso: string): boolean {
  const [, m, d] = splitIso(iso);
  return m === FISCAL_BREAK.month && d >= FISCAL_BREAK.fromDay && d <= FISCAL_BREAK.toDay;
}

/** Bir iş günü mü: hafta sonu değil ve resmî tatil değil. */
export function isBusinessDay(iso: string): boolean {
  return !isWeekend(iso) && !publicHoliday(iso).holiday;
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = splitIso(iso);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

export interface ShiftResult {
  /** Kaydırma sonrası ilk iş günü (ISO) — kaydırma yoksa girdiyle aynı */
  date: string;
  shifted: boolean;
  /** "hafta sonu" | "resmî tatil: Zafer Bayramı" gibi kısa açıklama */
  reason?: string;
}

/**
 * VUK Md. 18 kaydırması: verilen tarih hafta sonu veya resmî tatile denk
 * gelirse, takip eden ilk iş gününe uzatır. Zincirleme tatilleri (örn. 30
 * Ağustos pazar + ardından tatil) atlar.
 *
 * Mali tatil KASITLI olarak burada değil: 5604'ün +7 gün kuralı ayrı ve bu
 * fonksiyonun sözleşmesi (ilk iş günü) ile örtüşmüyor. Çağıran taraf
 * `inFiscalBreak` ile ayrıca işaretler.
 */
export function shiftToNextBusinessDay(iso: string): ShiftResult {
  splitIso(iso); // biçim doğrulaması

  if (isBusinessDay(iso)) return { date: iso, shifted: false };

  // İlk engelin sebebini açıklama için sakla
  const firstReason = isWeekend(iso)
    ? 'hafta sonu'
    : `resmî tatil: ${publicHoliday(iso).name ?? 'resmî tatil'}`;

  let cursor = iso;
  // En fazla 15 gün ilerle — sonsuz döngüye karşı güvenlik sınırı
  for (let i = 0; i < 15; i++) {
    cursor = addDaysIso(cursor, 1);
    if (isBusinessDay(cursor)) {
      return { date: cursor, shifted: true, reason: firstReason };
    }
  }

  throw new Error(`Kaydırma 15 gün içinde iş günü bulamadı: ${iso}`);
}
