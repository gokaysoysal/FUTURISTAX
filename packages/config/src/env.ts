import { z } from 'zod';

/**
 * Ortam değişkenleri runtime'da doğrulanır. Eksik/yanlış değerde uygulama
 * sessizce bozulmak yerine açılışta hata verir.
 *
 * NEXT_PUBLIC_ öneki YALNIZCA gerçekten herkese açık değerlerde kullanılır.
 *
 * ÖNEMLİ: Her iki doğrulama da TEMBEL (lazy) çalışır. Modül yüklenir yüklenmez
 * doğrulama yapılırsa, ortam değişkenine hiç ihtiyaç duymayan sayfalar bile
 * (robots.txt, sitemap.xml gibi) derleme sırasında çöker. Doğrulama yalnızca
 * değere gerçekten erişildiğinde tetiklenir.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // E-posta
  RESEND_API_KEY: z.string().min(1),
  CONTACT_INBOX: z.string().email(),

  // Spam koruması
  TURNSTILE_SECRET_KEY: z.string().min(1),

  // Veritabanı
  DATABASE_URL: z.string().url(),

  // Rate limit / cache
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // AI — YALNIZCA sunucuda. Asla NEXT_PUBLIC_ yapılmaz.
  ANTHROPIC_API_KEY: z.string().min(1),

  // CMS
  SANITY_API_READ_TOKEN: z.string().min(1),
  SANITY_REVALIDATE_SECRET: z.string().min(1),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function describe(issues: z.ZodIssue[]): string {
  return issues.map((issue) => issue.path.join('.')).join(', ');
}

let cachedServerEnv: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Sunucu ortam değişkenleri eksik veya geçersiz: ${describe(parsed.error.issues)}`,
    );
  }
  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

let cachedClientEnv: ClientEnv | null = null;

/**
 * NEXT_PUBLIC_ değişkenleri Next.js tarafından derleme sırasında bu statik
 * referanslar üzerinden gömülür. Bu yüzden `process.env` nesnesi tek parça
 * geçilmez; her alan tek tek yazılır.
 */
export function clientEnv(): ClientEnv {
  if (cachedClientEnv) return cachedClientEnv;
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  });
  if (!parsed.success) {
    throw new Error(
      `İstemci ortam değişkenleri eksik veya geçersiz: ${describe(parsed.error.issues)}`,
    );
  }
  cachedClientEnv = parsed.data;
  return cachedClientEnv;
}
