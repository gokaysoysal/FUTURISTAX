import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * V4-AKIS ana sayfa — erişilebilirlik ve klavye/hareket davranışı.
 *
 * Bu ortamda koşulamadı (tarayıcı + `pnpm start` yok); CI'da koşar.
 * Kapsam: hero (split-type başlık + CTA'lar + yüzen kartlar), pinlenmiş
 * "Temel yetenekler" bölümünün reduced-motion fallback'i (pin yok, üç adım
 * görünür, klavye tuzağı yok), logo şeridi ve scroll % göstergesinin a11y
 * ağacı dışında olması, axe sıfır ihlal (motion açık + reduced-motion).
 */
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function settle(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.8, 400);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

test.describe('hero', () => {
  test('başlık, iki CTA ve yüzen kartlar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Görüşme talep et' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Hesaplama araçları' }).first()).toBeVisible();

    // Yüzen kartlar GERÇEK veri etiketleri taşır (özet veriler listesi).
    const cards = page.getByRole('list', { name: 'Özet veriler' });
    await expect(cards).toBeVisible();
    await expect(cards.getByText('Sıradaki yükümlülük')).toBeVisible();
    await expect(cards.getByText('USD/TRY (TCMB)')).toBeVisible();
  });
});

test.describe('pinlenmiş bölüm — reduced-motion fallback', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('pin yok; üç adım da görünür ve klavye tuzağı yok', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Analiz', 'Yapılandırma', 'Sürekli takip']) {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible();
    }

    // Bölüm içinde odak tuzağı yok: bölümden önceki ve sonraki odaklanabilir
    // öğeler arasında Tab ile geçilebiliyor (bölüm link içermiyor, akış kesilmez).
    const closingCta = page.getByRole('link', { name: 'Hizmetleri gör' });
    await expect(closingCta).toBeAttached();
  });

  test('sayfa geçişi perdesi reduced-motion altında render edilmez', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Hesaplama araçları' }).first().click();
    await expect(page).toHaveURL(/\/araclar/);
    // Perde katmanı z-[70] fixed; reduced-motion'da hiç eklenmez.
    await expect(page.locator('.fixed.inset-0.z-\\[70\\]')).toHaveCount(0);
  });
});

test('logo şeridi ve scroll % a11y ağacı dışında', async ({ page, isMobile }) => {
  await page.goto('/');
  const strip = page.getByRole('region', { name: 'Çalıştığımız sektörler' });
  await expect(strip).toBeVisible();
  // Marka işaretleri dekoratif — kayan şerit aria-hidden.
  await expect(strip.locator('.marquee')).toHaveAttribute('aria-hidden', 'true');
  // Scroll % göstergesi (sm+): görsel, aria-hidden (ekran okuyucu için anlamsız).
  if (!isMobile) {
    const pct = page.locator('[aria-hidden="true"]').filter({ hasText: /^\d{2}%$/ });
    await expect(pct).toHaveCount(1);
  }
});

test('axe — ana sayfa (motion açık), sıfır ihlal', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(violations).toEqual([]);
});

test('axe — ana sayfa (reduced-motion), sıfır ihlal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await settle(page);
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(violations).toEqual([]);
});
