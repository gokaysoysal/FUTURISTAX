import { expect, test } from '@playwright/test';

/**
 * Hydration testleri — ADR 0004.
 *
 * Geçmişte CSP nonce'u Next.js'e ulaşmayınca sayfalar sunucuda render ediliyor
 * ama tarayıcıda hiçbir script çalışmıyordu: "görünmek" ile "çalışmak" farklı.
 * Bu testler React'in gerçekten devreye girdiğini doğrular ve CSP (Report-Only)
 * açıkken de geçmelidir.
 */
test.describe('hydration', () => {
  test('hesaplayıcı girdisi sonuca yansır (client state)', async ({ page }) => {
    await page.goto('/araclar/kdv');

    const result = page.locator('[aria-live="polite"]');
    await expect(result).toContainText('₺');

    const amountField = page.getByLabel('Tutar (₺)');
    await amountField.fill('1000');
    const before = (await result.textContent()) ?? '';

    await amountField.fill('987654');
    await expect(result).not.toHaveText(before);
  });

  test('mobil menü düğmesi açılıp kapanır (client JS)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobil menü' })).toBeVisible();
    await page.getByRole('button', { name: 'Menüyü kapat' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobil menü' })).toBeHidden();
  });

  test('CSP Report-Only başlığı nonce ile gönderiliyor', async ({ page }) => {
    const response = await page.goto('/');
    const csp = response?.headers()['content-security-policy-report-only'] ?? '';
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain('nonce-');
    expect(csp).toContain('challenges.cloudflare.com');
  });

  test('zorlayıcı (enforce) CSP ihlali yok', async ({ page }) => {
    const blocked: string[] = [];
    page.on('console', (message) => {
      const text = message.text();
      if (
        text.includes('Content Security Policy') &&
        !text.toLowerCase().includes('report only') &&
        !text.toLowerCase().includes('report-only')
      ) {
        blocked.push(text);
      }
    });
    await page.goto('/araclar/kur-cevirici');
    await page.waitForLoadState('networkidle');
    expect(blocked).toEqual([]);
  });
});
