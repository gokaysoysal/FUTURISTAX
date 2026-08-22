import { describe, expect, it } from 'vitest';
import { buildIcsFeed, getUpcomingDeadlines } from '../calendar/tax-calendar';

describe('vergi takvimi', () => {
  it('referans tarihten sonraki yükümlülükleri sıralı döndürür', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-03-01', horizonDays: 60 });
    expect(d.length).toBeGreaterThan(0);
    const dates = d.map((x) => x.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it('geçmiş tarihleri dışlar', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-03-29', horizonDays: 30 });
    expect(d.every((x) => x.daysRemaining >= 0)).toBe(true);
  });

  it('ufuk dışına taşmaz', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-01-01', horizonDays: 15 });
    expect(d.every((x) => x.daysRemaining <= 15)).toBe(true);
  });

  it('mükellef tipine göre filtreler', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-04-01', horizonDays: 40, taxpayerType: 'employer' });
    expect(d.every((x) => x.taxpayerTypes.includes('employer'))).toBe(true);
  });

  it('kurumlar vergisi beyanını nisan ayında bulur', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-04-01', horizonDays: 40, taxpayerType: 'corporate' });
    const kv = d.find((x) => x.ruleId === 'kurumlar-vergisi');
    expect(kv?.date).toBe('2026-04-25');
  });

  it('kısa ayda ayın son gününü aşmaz', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-02-01', horizonDays: 30 });
    const berat = d.find((x) => x.ruleId === 'edefter-berat');
    expect(berat?.date).toBe('2026-02-28');
  });

  it('aciliyet sınıflandırması yapar', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-04-24', horizonDays: 5, taxpayerType: 'corporate' });
    const kv = d.find((x) => x.ruleId === 'kurumlar-vergisi');
    expect(kv?.urgency).toBe('imminent');
  });

  it('geçerli bir ics beslemesi üretir', () => {
    const d = getUpcomingDeadlines({ referenceDate: '2026-04-01', horizonDays: 40 });
    const ics = buildIcsFeed(d, 'Vergi Takvimi');
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics.split('BEGIN:VEVENT').length - 1).toBe(d.length);
  });

  it('geçersiz referans tarihte hata verir', () => {
    expect(() => getUpcomingDeadlines({ referenceDate: 'bozuk' })).toThrow();
  });
});
