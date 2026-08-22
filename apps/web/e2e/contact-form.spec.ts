import { expect, test } from '@playwright/test';

/**
 * İletişim formu — sitenin en kritik dönüşüm akışı.
 * Eski sürümde form hiçbir yere veri göndermiyordu; bu test o regresyonu yakalar.
 */
test.describe('danışmanlık talep formu', () => {
  test.beforeEach(async ({ page }) => page.goto('/iletisim'));

  test('boş gönderimde erişilebilir hata gösterir', async ({ page }) => {
    await page.getByRole('button', { name: 'Talebi gönder' }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('KVKK onayı olmadan gönderime izin vermez', async ({ page }) => {
    await page.getByLabel('Ad soyad').fill('Test Kullanıcı');
    await page.getByLabel('E-posta').fill('test@example.com');
    await page.getByLabel('Konu').selectOption('vergi-danismanligi');
    await page.getByLabel('Talebiniz').fill('Kurumlar vergisi planlaması hakkında bilgi almak istiyorum.');
    await page.getByRole('button', { name: 'Talebi gönder' }).click();
    await expect(page.getByText('aydınlatma metnini onaylayın')).toBeVisible();
  });

  test('geçerli gönderimde API çağrısı yapar', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ json: { ok: true, message: 'Talebiniz alındı.' } }),
    );

    await page.getByLabel('Ad soyad').fill('Test Kullanıcı');
    await page.getByLabel('E-posta').fill('test@example.com');
    await page.getByLabel('Konu').selectOption('vergi-danismanligi');
    await page.getByLabel('Talebiniz').fill('Kurumlar vergisi planlaması hakkında bilgi almak istiyorum.');
    await page.getByLabel(/aydınlatma metni/).check();

    const request = page.waitForRequest('**/api/contact');
    await page.getByRole('button', { name: 'Talebi gönder' }).click();
    expect((await request).method()).toBe('POST');
    await expect(page.getByText('Talebiniz alındı')).toBeVisible();
  });
});
