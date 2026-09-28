import { describe, expect, it } from 'vitest';
import { backdropPathAt } from './backdrop-path';
import { dampScenePath, sceneToUniforms } from './backdrop-runtime';

describe('dampScenePath', () => {
  it('k=0 iken mevcut durumu değiştirmez', () => {
    const current = backdropPathAt(0);
    const target = backdropPathAt(1);
    expect(dampScenePath(current, target, 0)).toEqual(current);
  });

  it('k=1 iken doğrudan hedefe oturur', () => {
    const current = backdropPathAt(0);
    const target = backdropPathAt(1);
    const result = dampScenePath(current, target, 1);
    expect(result.smallSphere.x).toBeCloseTo(target.smallSphere.x, 10);
    expect(result.light).toBeCloseTo(target.light, 10);
  });

  it('0 < k < 1 iken current ile target arasında kalır', () => {
    const current = backdropPathAt(0);
    const target = backdropPathAt(1);
    const result = dampScenePath(current, target, 0.06);
    const lo = Math.min(current.light, target.light);
    const hi = Math.max(current.light, target.light);
    expect(result.light).toBeGreaterThanOrEqual(lo);
    expect(result.light).toBeLessThanOrEqual(hi);
  });
});

describe('sceneToUniforms', () => {
  it('fare (0,0) iken sahne değerlerini olduğu gibi döner', () => {
    const state = backdropPathAt(0.4);
    const { small, big } = sceneToUniforms(state, { x: 0, y: 0 });
    expect(small).toEqual([state.smallSphere.x, state.smallSphere.y, state.smallSphere.r]);
    expect(big).toEqual([state.bigSphere.x, state.bigSphere.y, state.bigSphere.r]);
  });

  it('küçük ve büyük küre zıt yönde ofsetlenir (derinlik hissi)', () => {
    const state = backdropPathAt(0.4);
    const { small, big } = sceneToUniforms(state, { x: 1, y: 0 });
    expect(small[0]).toBeGreaterThan(state.smallSphere.x);
    expect(big[0]).toBeLessThan(state.bigSphere.x);
  });

  it('yarıçapı ASLA değiştirmez', () => {
    const state = backdropPathAt(0.7);
    const { small, big } = sceneToUniforms(state, { x: -1, y: 1 });
    expect(small[2]).toBe(state.smallSphere.r);
    expect(big[2]).toBe(state.bigSphere.r);
  });
});
