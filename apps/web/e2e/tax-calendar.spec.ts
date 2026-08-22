import { expect, test } from '@playwright/test';

test.describe('vergi takvimi', () => {
  test('ana sayfada yükümlülükleri gösterir', async ({ page }) => {
    await page.goto('/');
    const panel = page.getByRole('region', { name: 'Yaklaşan yükümlülükler' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('listitem').first()).toBeVisible();
  });

  test('ics dosyası indirilebilir', async ({ page, request }) => {
    await page.goto('/');
    const response = await request.get('/api/calendar?taxpayerType=corporate');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/calendar');
    expect(await response.text()).toContain('BEGIN:VCALENDAR');
  });
});
