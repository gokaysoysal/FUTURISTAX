import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Erişilebilirlik testleri.
 *
 * Eski sitede zoom kapalıydı, imleç gizliydi, kontrast AA altındaydı ve
 * navigasyon klavyeyle kullanılamıyordu. Bu testler o hataların geri
 * dönmesini engeller. Sıfır ihlal zorunludur.
 *
 * Kapsam Bölüm 7'de genişletildi: yeni içerik, hub, detay, araç ve mevzuat
 * sayfaları da taranıyor.
 */
const PAGES = [
  '/',
  '/kurumsal',
  '/hizmetler',
  '/hizmetler/vergi-danismanligi',
  '/sektorler',
  '/sektorler/imalat',
  '/araclar',
  '/araclar/kdv',
  '/araclar/kur-cevirici',
  '/mevzuat',
  '/mevzuat/mali-tatil-nedir',
  '/sss',
  '/referanslar',
  '/kariyer',
  '/iletisim',
];

/**
 * Sayfayı sonuna kadar kaydırıp scroll-reveal animasyonlarını (Reveal:
 * whileInView) tetikler, sonra başa döner. Böylece axe geçici opacity:0
 * karesini değil, içeriğin nihai render hâlini denetler.
 */
async function settleReveals(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.8, 400);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

for (const path of PAGES) {
  test(`${path} — axe ihlali yok`, async ({ page }) => {
    await page.goto(path);
    await settleReveals(page);
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
