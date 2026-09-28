import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Tasarım yönü değişimi koşusunda eklenen bileşenlerin erişilebilirliği.
 *
 * Vergi Yükü Panosu, Yıl Karşılaştırma ve Komut Paleti için axe taraması;
 * ayrıca komut paletinin YALNIZCA klavyeyle tam kullanılabildiği. Sıfır ihlal.
 */

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('yeni bileşenler — axe', () => {
  test('Vergi Yükü Panosu — grafik yüklendikten sonra ihlal yok', async ({ page }) => {
    await page.goto('/');
    const panel = page.getByTestId('tax-burden-panel');
    // Grafik IntersectionObserver ile ertelendi (Bölüm 7); panel görünüre gelsin.
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();

    // Bir girdiyi oynat; sonuçlar ve tembel grafik güncellensin.
    await panel.locator('input[type="range"]').first().fill('12000000');
    await expect(panel.locator('.recharts-surface').first()).toBeVisible({ timeout: 15000 });

    // Grafiklerin ekran okuyucu karşılığı: iki sr-only tablo her zaman DOM'da.
    await expect(panel.locator('table')).toHaveCount(2);

    const { violations } = await new AxeBuilder({ page })
      .include('[data-testid="tax-burden-panel"]')
      .withTags(WCAG)
      .analyze();
    expect(violations).toEqual([]);
  });

  test('Yıl Karşılaştırma — ihlal yok + yön metinle de var (WCAG 1.4.1)', async ({ page }) => {
    await page.goto('/araclar');
    const panel = page.getByTestId('year-comparison-panel');
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    await expect(panel.locator('.recharts-surface').first()).toBeVisible({ timeout: 15000 });

    // Fark yönü renkten bağımsız: sr-only sözcük ("artış"/"azalış"/"değişim yok").
    await expect(
      panel.locator('.sr-only', { hasText: /artış|azalış|değişim yok/ }).first(),
    ).toBeAttached();

    const { violations } = await new AxeBuilder({ page })
      .include('[data-testid="year-comparison-panel"]')
      .withTags(WCAG)
      .analyze();
    expect(violations).toEqual([]);
  });

  test('Komut paleti — açıkken ihlal yok', async ({ page }) => {
    await page.goto('/');
    // Düğmeyle aç (her cihazda güvenilir; kısayol ayrı testte).
    await page.getByRole('button', { name: 'Site içinde ara' }).click();

    const dialog = page.getByRole('dialog', { name: 'Site içi arama' });
    await expect(dialog).toBeVisible();
    await page.getByRole('combobox').fill('vergi');
    await expect(dialog.getByRole('option').first()).toBeVisible();

    const { violations } = await new AxeBuilder({ page })
      .include('dialog.cmdk')
      .withTags(WCAG)
      .analyze();
    expect(violations).toEqual([]);
  });
});

test('Komut paleti — Cmd/Ctrl+K kısayolu açar/kapatır', async ({ page, isMobile }) => {
  test.skip(isMobile, 'donanım klavyesi kısayolu yalnızca masaüstü');
  await page.goto('/');
  await page.locator('body').click();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog', { name: 'Site içi arama' })).toBeVisible();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog', { name: 'Site içi arama' })).toBeHidden();
});

test('Komut paleti — klavyeyle tam akış: aç, gez, seç, Esc ile kapat', async ({ page }) => {
  await page.goto('/');

  // Header "Ara" düğmesiyle aç — kapanınca odağın döneceği hedef belirli olsun.
  await page.getByRole('button', { name: 'Site içinde ara' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site içi arama' });
  await expect(dialog).toBeVisible();

  // Odak arama girdisinde.
  const combo = page.getByRole('combobox');
  await expect(combo).toBeFocused();

  // Yaz → sonuç listesi.
  await combo.fill('vergi');
  const options = dialog.getByRole('option');
  await expect(options.first()).toBeVisible();

  // İlk seçenek aktif; ok tuşuyla ilerle (aria-activedescendant güncellenir).
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(combo).toHaveAttribute('aria-activedescendant', 'cmdk-opt-1');

  // Enter → gezinme; palet kapanır.
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/\/$/);

  // Yeniden aç, Esc ile kapat, odak tetikleyici düğmeye döner.
  await page.getByRole('button', { name: 'Site içinde ara' }).click();
  await expect(page.getByRole('dialog', { name: 'Site içi arama' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Site içi arama' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Site içinde ara' })).toBeFocused();
});
