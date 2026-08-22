import { defineConfig } from 'drizzle-kit';

/**
 * Bağlantı dizesi iki adla gelebilir:
 *   DATABASE_URL          — elle kurulum
 *   NETLIFY_DATABASE_URL  — Netlify'ın Neon eklentisi
 * İkisi de desteklenir.
 */
const url = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;

if (!url) {
  throw new Error(
    'Veritabanı bağlantı dizesi bulunamadı. .env.local dosyasına DATABASE_URL yazın.',
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
