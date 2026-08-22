import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Erişilebilirlik testleri.
 *
 * Eski sitede zoom kapalıydı, imleç gizliydi, kontrast AA altındaydı ve
 * navigasyon klavyeyle kullanılamıyordu. Bu testler o hataların geri
 * dönmesini engeller. Sıfır ihlal zorunludur.
 */
const PAGES = ['/', '/araclar', '/iletisim'];

for (const path of PAGES) {
  test(`${path} — axe ihlali yok`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('yakınlaştırma engellenmemiş', async ({ page }) => {
  await page.goto('/');
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).not.toContain('user-scalable=no');
  expect(viewport).not.toContain('maximum-scale');
});

test('içeriğe geç bağlantısı klavyeyle erişilebilir', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'İçeriğe geç' })).toBeFocused();
});

test('navigasyon gerçek bağlantılardan oluşur ve geri tuşu çalışır', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Hesaplama araçları' }).first().click();
  await expect(page).toHaveURL(/\/araclar/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});
