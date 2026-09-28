import { afterEach, describe, expect, it } from 'vitest';
import {
  RELIGIOUS_HOLIDAYS_BY_YEAR,
  inFiscalBreak,
  isBusinessDay,
  isWeekend,
  publicHoliday,
  religiousHolidaysKnown,
  shiftToNextBusinessDay,
} from '../calendar/holidays';
import { getUpcomingDeadlines } from '../calendar/tax-calendar';

describe('shiftToNextBusinessDay — VUK Md. 18', () => {
  it('iş gününü değiştirmez', () => {
    // 25 Ağustos 2026 salı
    const r = shiftToNextBusinessDay('2026-08-25');
    expect(r).toEqual({ date: '2026-08-25', shifted: false });
  });

  it('cumartesiyi pazartesiye kaydırır', () => {
    // 25 Nisan 2026 cumartesi
    const r = shiftToNextBusinessDay('2026-04-25');
    expect(r.date).toBe('2026-04-27');
    expect(r.shifted).toBe(true);
    expect(r.reason).toBe('hafta sonu');
  });

  it('pazarı pazartesiye kaydırır', () => {
    // 1 Mart 2026 pazar
    const r = shiftToNextBusinessDay('2026-03-01');
    expect(r.date).toBe('2026-03-02');
    expect(r.reason).toBe('hafta sonu');
  });

  it('hafta içi resmî tatili takip eden iş gününe kaydırır', () => {
    // 1 Ocak 2026 perşembe (Yılbaşı) → 2 Ocak cuma
    const r = shiftToNextBusinessDay('2026-01-01');
    expect(r.date).toBe('2026-01-02');
    expect(r.shifted).toBe(true);
    expect(r.reason).toBe('resmî tatil: Yılbaşı');
  });

  it('zincirleme tatil + hafta sonunu atlar — 30 Ağustos 2026', () => {
    // 30 Ağustos 2026: hem pazar hem Zafer Bayramı → 31 Ağustos pazartesi
    const r = shiftToNextBusinessDay('2026-08-30');
    expect(r.date).toBe('2026-08-31');
    expect(r.shifted).toBe(true);
    // İlk engel hafta sonu olduğu için sebep "hafta sonu"
    expect(r.reason).toBe('hafta sonu');
  });

  it('yarım gün (28 Ekim) + tam tatil (29 Ekim) zincirini atlar', () => {
    // 28 Ekim 2026 çarşamba (arife, yarım gün) → 29 perşembe (tam tatil) → 30 cuma
    const r = shiftToNextBusinessDay('2026-10-28');
    expect(r.date).toBe('2026-10-30');
    expect(r.reason).toBe('resmî tatil: Cumhuriyet Bayramı arifesi');
  });

  it('geçersiz tarihte hata verir', () => {
    expect(() => shiftToNextBusinessDay('bozuk')).toThrow();
  });

  it('deterministiktir', () => {
    expect(shiftToNextBusinessDay('2026-08-30')).toEqual(shiftToNextBusinessDay('2026-08-30'));
  });
});

describe('tatil yardımcıları', () => {
  it('hafta sonunu tanır', () => {
    expect(isWeekend('2026-08-29')).toBe(true); // cumartesi
    expect(isWeekend('2026-08-30')).toBe(true); // pazar
    expect(isWeekend('2026-08-31')).toBe(false); // pazartesi
  });

  it('sabit resmî tatilleri tanır', () => {
    expect(publicHoliday('2026-08-30')).toEqual({ holiday: true, name: 'Zafer Bayramı' });
    expect(publicHoliday('2026-05-01').holiday).toBe(true);
    expect(publicHoliday('2026-06-10').holiday).toBe(false);
  });

  it('iş gününü hafta sonu ve tatile göre belirler', () => {
    expect(isBusinessDay('2026-08-31')).toBe(true);
    expect(isBusinessDay('2026-08-30')).toBe(false);
    expect(isBusinessDay('2026-01-01')).toBe(false);
  });

  it('mali tatil aralığını tanır (1–20 Temmuz)', () => {
    expect(inFiscalBreak('2026-07-01')).toBe(true);
    expect(inFiscalBreak('2026-07-20')).toBe(true);
    expect(inFiscalBreak('2026-07-21')).toBe(false);
    expect(inFiscalBreak('2026-06-30')).toBe(false);
  });

  it('dinî bayram tarihleri henüz girilmedi — kaydırmaya dahil değil', () => {
    // Bu, "uydurma resmî tarih üretme" kuralının test düzeyindeki karşılığı.
    expect(religiousHolidaysKnown(2024)).toBe(false);
    expect(religiousHolidaysKnown(2025)).toBe(false);
    expect(religiousHolidaysKnown(2026)).toBe(false);
  });
});

describe('dinî bayram verisi girildiğinde kaydırmaya katılır', () => {
  // Sentetik gelecek yıl fixture'ı — GERÇEK tarih değil, yalnızca kod yolunu
  // doğrulamak için. Üretim verisi RELIGIOUS_HOLIDAYS_BY_YEAR içinde null.
  afterEach(() => {
    // "girilmedi" durumuna geri al (delete yerine — biome noDelete)
    RELIGIOUS_HOLIDAYS_BY_YEAR[2099] = null;
  });

  it('aralık içindeki günü tatil sayar ve kaydırır', () => {
    RELIGIOUS_HOLIDAYS_BY_YEAR[2099] = [
      { from: '2099-03-16', to: '2099-03-18', name: 'Test Bayramı' },
    ];
    expect(publicHoliday('2099-03-17')).toEqual({ holiday: true, name: 'Test Bayramı' });
    expect(religiousHolidaysKnown(2099)).toBe(true);
    // 2099-03-17 tatil → sonraki iş gününe kayar
    const r = shiftToNextBusinessDay('2099-03-17');
    expect(r.shifted).toBe(true);
    expect(r.date > '2099-03-18').toBe(true);
  });
});

describe('getUpcomingDeadlines — kaydırma uygulanmış hâlde', () => {
  it('30 Ağustos 2026 Ba-Bs son tarihini 31 Ağustosa taşır', () => {
    const d = getUpcomingDeadlines({
      referenceDate: '2026-08-01',
      horizonDays: 45,
      taxpayerType: 'soleTrader',
    });
    const baBs = d.find((x) => x.ruleId === 'ba-bs');
    expect(baBs?.statutoryDate).toBe('2026-08-30');
    expect(baBs?.date).toBe('2026-08-31');
    expect(baBs?.shifted).toBe(true);
    expect(baBs?.fiscalBreakCaution).toBe(false);
  });

  it('kaydırılmayan yükümlülükte shifted=false ve tarihler eşit', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-08-01', horizonDays: 45 });
    const anyUnshifted = d.find((x) => !x.shifted);
    expect(anyUnshifted).toBeDefined();
    expect(anyUnshifted?.date).toBe(anyUnshifted?.statutoryDate);
  });

  it('kalan gün ve aciliyet ETKİN tarihe göre hesaplanır', () => {
    // 24 Nisan 2026 cuma; kurumlar vergisi kanuni 25 Nisan cmt → etkin 27 Nisan
    const d = getUpcomingDeadlines({
      referenceDate: '2026-04-24',
      horizonDays: 10,
      taxpayerType: 'corporate',
    });
    const kv = d.find((x) => x.ruleId === 'kurumlar-vergisi');
    expect(kv?.date).toBe('2026-04-27');
    expect(kv?.daysRemaining).toBe(3);
    expect(kv?.urgency).toBe('imminent');
  });
});
