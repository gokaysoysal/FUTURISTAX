import { describe, expect, it } from 'vitest';
import { calculateVat } from '../calculators/vat';
import { getRates } from '../rates';

const rates = getRates(2025);

describe('KDV hesaplama', () => {
  it('KDV hariç tutara %20 ekler', () => {
    const r = calculateVat({ amount: 1000, direction: 'add', band: 'standard' }, rates);
    expect(r.detail.net).toBe(1000);
    expect(r.detail.vat).toBeCloseTo(200, 6);
    expect(r.detail.gross).toBeCloseTo(1200, 6);
  });

  it('KDV dahil tutardan matrahı ayrıştırır', () => {
    const r = calculateVat({ amount: 1200, direction: 'extract', band: 'standard' }, rates);
    expect(r.detail.net).toBeCloseTo(1000, 6);
    expect(r.detail.vat).toBeCloseTo(200, 6);
  });

  it('ekleme ve ayrıştırma birbirinin tersidir', () => {
    const added = calculateVat({ amount: 4567.89, direction: 'add', band: 'reduced' }, rates);
    const back = calculateVat(
      { amount: added.detail.gross, direction: 'extract', band: 'reduced' },
      rates,
    );
    expect(back.detail.net).toBeCloseTo(4567.89, 6);
  });

  it('%1 ve %10 dilimlerini uygular', () => {
    expect(
      calculateVat({ amount: 100, direction: 'add', band: 'basic' }, rates).detail.vat,
    ).toBeCloseTo(1, 6);
    expect(
      calculateVat({ amount: 100, direction: 'add', band: 'reduced' }, rates).detail.vat,
    ).toBeCloseTo(10, 6);
  });

  it('negatif tutarı sıfıra çeker', () => {
    expect(
      calculateVat({ amount: -500, direction: 'add', band: 'standard' }, rates).detail.vat,
    ).toBe(0);
  });
});
