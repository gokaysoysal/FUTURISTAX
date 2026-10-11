import { describe, expect, it } from 'vitest';
import { PATH_KEYFRAMES, backdropPathAt } from './backdrop-path';

describe('backdropPathAt', () => {
  it('anahtar karelerde tam olarak kayıtlı değerleri verir', () => {
    for (const kf of PATH_KEYFRAMES) {
      const s = backdropPathAt(kf.p);
      expect(s.smallSphere.x).toBeCloseTo(kf.small[0], 10);
      expect(s.smallSphere.y).toBeCloseTo(kf.small[1], 10);
      expect(s.smallSphere.r).toBeCloseTo(kf.small[2], 10);
      expect(s.bigSphere.x).toBeCloseTo(kf.big[0], 10);
      expect(s.bigSphere.y).toBeCloseTo(kf.big[1], 10);
      expect(s.bigSphere.r).toBeCloseTo(kf.big[2], 10);
      expect(s.light).toBeCloseTo(kf.light, 10);
    }
  });

  it('sınır dışı p değerlerini kenetler (0 ve 1 ile aynı sonucu verir)', () => {
    const below = backdropPathAt(-5);
    const at0 = backdropPathAt(0);
    expect(below).toEqual(at0);

    const above = backdropPathAt(5);
    const at1 = backdropPathAt(1);
    expect(above).toEqual(at1);
  });

  it('süreklidir — bir anahtar kare çevresinde ani sıçrama yok', () => {
    for (const kf of PATH_KEYFRAMES.slice(1, -1)) {
      const eps = 1e-4;
      const before = backdropPathAt(kf.p - eps);
      const after = backdropPathAt(kf.p + eps);
      expect(Math.abs(before.smallSphere.x - after.smallSphere.x)).toBeLessThan(0.01);
      expect(Math.abs(before.smallSphere.y - after.smallSphere.y)).toBeLessThan(0.01);
      expect(Math.abs(before.light - after.light)).toBeLessThan(0.01);
    }
  });

  it('yoğun örneklemede de ani sıçrama yok (adım başına küçük delta)', () => {
    const steps = 200;
    let prev = backdropPathAt(0);
    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const cur = backdropPathAt(p);
      expect(Math.abs(cur.smallSphere.x - prev.smallSphere.x)).toBeLessThan(0.05);
      expect(Math.abs(cur.smallSphere.y - prev.smallSphere.y)).toBeLessThan(0.05);
      expect(Math.abs(cur.bigSphere.x - prev.bigSphere.x)).toBeLessThan(0.05);
      expect(Math.abs(cur.light - prev.light)).toBeLessThan(0.05);
      prev = cur;
    }
  });

  it('ışık evresi ölçülen aralıkta kalır (docs/qa/palet.md düzeltmesi)', () => {
    for (let i = 0; i <= 20; i++) {
      const p = i / 20;
      const { light } = backdropPathAt(p);
      expect(light).toBeGreaterThanOrEqual(-0.01);
      expect(light).toBeLessThanOrEqual(1.01);
    }
  });
});
