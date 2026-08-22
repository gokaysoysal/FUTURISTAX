import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit, Next.js gibi `.env.local` dosyasını kendiliğinden okumaz.
 * Bu yüzden dosyayı burada elle yüklüyoruz.
 *
 * Ek bir bağımlılık (dotenv) getirmemek için küçük bir okuyucu yazıldı:
 * yalnızca `ANAHTAR=değer` satırlarını işler, yorumları ve boş satırları atlar.
 * Zaten tanımlı olan değişkenlerin üzerine YAZMAZ — böylece CI ve Netlify'da
 * panelden gelen değerler geçerli kalır.
 */
function loadEnvFile(fileName: string): void {
  const path = resolve(process.cwd(), fileName);
  if (!existsSync(path)) return;

  // Not Defteri UTF-8 (BOM'lu) kaydettiyse ilk karakteri temizle.
  const contents = readFileSync(path, 'utf8').replace(/^\uFEFF/, '');

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    // Değer tırnak içindeyse tırnakları at.
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) value = value.slice(1, -1);

    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

/**
 * Bağlantı dizesi iki adla gelebilir:
 *   DATABASE_URL          — elle kurulum
 *   NETLIFY_DATABASE_URL  — Netlify'ın Neon eklentisi
 */
const url = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;

if (!url) {
  throw new Error(
    'Veritabanı bağlantı dizesi bulunamadı.\n' +
      `Aranan konum: ${resolve(process.cwd(), '.env.local')}\n` +
      'Dosyada şu satır olmalı: DATABASE_URL=postgresql://...',
  );
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
