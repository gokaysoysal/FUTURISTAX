import { expect, test } from '@playwright/test';

/**
 * V11 arka plan sahnesi — docs/V11-SAHNE-PROMPT.md "BİTİRİRKEN".
 *
 * Viewport masaüstü genişliğine sabitlenir: `SiteBackdrop` yalnızca
 * ≥768px + WebGL + reduced-motion yokken canlı sahneyi (`<canvas>`) monte
 * eder (aksi hâlde CSS yedeği — bkz. SiteBackdrop.tsx).
 */
test.describe('V11 backdrop sahnesi', () => {
  test('canvas monte olur ve data-backdrop-state geçerli bir ilerleme değeri taşır', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const backdrop = page.getByTestId('site-backdrop');
    const canvas = backdrop.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    const stateEl = backdrop.locator('[data-backdrop-state]');
    await expect(stateEl).toHaveCount(1);
    const raw = await stateEl.getAttribute('data-backdrop-state');
    const value = Number.parseFloat(raw ?? 'NaN');
    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  });

  test('prefers-reduced-motion altında canvas monte olmaz (statik CSS yedeği)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const backdrop = page.getByTestId('site-backdrop');
    await expect(backdrop).toBeVisible();
    await expect(backdrop.locator('canvas')).toHaveCount(0);
  });
});
