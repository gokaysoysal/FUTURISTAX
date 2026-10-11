import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * ARAÇLAR ÇALIŞMA ALANI — erişilebilirlik ve klavye akışı (V3 Bölüm 8).
 *
 * Bu ortamda (tarayıcı + `pnpm start` yok) çalıştırılamadı; CI'da koşar.
 * Kapsam:
 *  - Araç seçici APG tabs deseni: ok tuşları, Home/End, roving tabindex,
 *    aria-selected + odak takibi.
 *  - Her aracın kendi URL'i: seçim `/araclar/[slug]`'a yazılır; derin link ve
 *    tarayıcı geri/ileri (popstate) seçiciyi senkronlar.
 *  - LedgerChart ekran okuyucu karşılığı: grafik `aria-hidden`, veri eşleniği
 *    `ResultLedger`'ın sr-only adım tablosu.
 *  - Komut paleti çalışma alanından klavyeyle tam erişilebilir.
 */

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('araç seçici — klavye (APG tabs)', () => {
  test('ok tuşları / Home / End seçimi ve odağı taşır', async ({ page }) => {
    await page.goto('/araclar');

    const tablist = page.getByRole('tablist', { name: 'Hesaplama aracı' });
    await expect(tablist).toBeVisible();

    const first = page.getByRole('tab', { name: 'KDV hesaplama' });
    const second = page.getByRole('tab', { name: 'Gelir vergisi' });

    // Başlangıç: ilk sekme seçili, roving tabindex.
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(first).toHaveAttribute('tabindex', '0');
    await expect(second).toHaveAttribute('tabindex', '-1');

    // Sekmeye odaklan, sağ ok → sonraki seçili + odaklı.
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('tabindex', '0');
    await expect(first).toHaveAttribute('tabindex', '-1');

    // Sol ok → başa döner.
    await page.keyboard.press('ArrowLeft');
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(first).toBeFocused();

    // Sol ok baştayken → sona sarar (dairesel).
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: 'Kur çevirici' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Home → ilk, End → son.
    await page.keyboard.press('Home');
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Kur çevirici' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('seçili sekme, etiketiyle bağlı bir tabpanel gösterir', async ({ page }) => {
    await page.goto('/araclar');
    const panel = page.getByRole('tabpanel');
    await expect(panel).toBeVisible();
    // Panel, seçili sekmeye aria-labelledby ile bağlı.
    await expect(panel).toHaveAttribute('aria-labelledby', 'tool-tab-kdv');
    await page.getByRole('tab', { name: 'Gelir vergisi' }).click();
    await expect(panel).toHaveAttribute('aria-labelledby', 'tool-tab-gelir-vergisi');
  });
});

test.describe('araç URL — derin link + geri/ileri', () => {
  test('sekme seçimi URL’i /araclar/[slug] yapar', async ({ page }) => {
    await page.goto('/araclar');
    await page.getByRole('tab', { name: 'Kurumlar vergisi' }).click();
    await expect(page).toHaveURL(/\/araclar\/kurumlar-vergisi$/);
    await expect(page.getByRole('heading', { level: 2, name: /Kurumlar vergisi/ })).toBeVisible();
  });

  test('derin link doğru aracı seçili açar', async ({ page }) => {
    await page.goto('/araclar/gelir-vergisi');
    await expect(page.getByRole('tab', { name: 'Gelir vergisi' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'tool-tab-gelir-vergisi',
    );
  });

  test('tarayıcı geri/ileri seçiciyi senkronlar (popstate)', async ({ page }) => {
    await page.goto('/araclar/gelir-vergisi');
    await page.getByRole('tab', { name: 'Kurumlar vergisi' }).click();
    await expect(page).toHaveURL(/\/araclar\/kurumlar-vergisi$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/araclar\/gelir-vergisi$/);
    await expect(page.getByRole('tab', { name: 'Gelir vergisi' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.goForward();
    await expect(page).toHaveURL(/\/araclar\/kurumlar-vergisi$/);
    await expect(page.getByRole('tab', { name: 'Kurumlar vergisi' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

test.describe('LedgerChart — ekran okuyucu karşılığı', () => {
  test('grafik aria-hidden; veri eşleniği sr-only adım tablosu', async ({ page }) => {
    await page.goto('/araclar/kdv');
    const panel = page.getByRole('tabpanel');

    // Grafik görsel ve a11y ağacının DIŞINDA: figure[aria-hidden].
    const figure = panel.locator('figure[aria-hidden="true"]');
    await expect(figure).toBeVisible();
    // aria-hidden olduğu için "figure" rolü a11y ağacına çıkmaz.
    await expect(panel.getByRole('figure')).toHaveCount(0);
    // Grafiğin lejant listesi de gizli ağacın içinde (çift okuma yok).
    await expect(figure.locator('ul li').first()).toBeAttached();

    // Veri eşleniği: ResultLedger'ın adım tablosu, caption'ıyla erişilebilir.
    const table = panel.getByRole('table', { name: 'Hesaplama adımları ve yasal dayanakları' });
    await expect(table).toBeAttached();
    await expect(table.getByRole('rowheader', { name: /Matrah \(KDV hariç\)/ })).toBeAttached();
    await expect(table.getByRole('rowheader', { name: /Hesaplanan KDV/ })).toBeAttached();
  });

  test('çalışma alanı — axe ihlali yok (varsayılan dışı araç + klavye sonrası)', async ({
    page,
  }) => {
    await page.goto('/araclar/sgk-isveren-maliyeti');
    await expect(page.getByRole('tabpanel')).toBeVisible();

    // Klavyeyle bir sekme değiştir; sonra tara.
    await page.getByRole('tab', { name: 'SGK işveren maliyeti' }).focus();
    await page.keyboard.press('ArrowRight');

    const { violations } = await new AxeBuilder({ page })
      .include('#tool-panel')
      .withTags(WCAG)
      .analyze();
    expect(violations).toEqual([]);
  });
});

test('komut paleti — çalışma alanından klavyeyle tam akış', async ({ page }) => {
  await page.goto('/araclar');

  await page.getByRole('button', { name: 'Site içinde ara' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site içi arama' });
  await expect(dialog).toBeVisible();

  const combo = page.getByRole('combobox');
  await expect(combo).toBeFocused();
  await combo.fill('gelir');

  const options = dialog.getByRole('option');
  await expect(options.first()).toBeVisible();
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Site içinde ara' })).toBeFocused();
});
