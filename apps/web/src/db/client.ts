import { serverEnv } from '@futuristax/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

/**
 * Veritabanı istemcisi. Yalnızca sunucuda kullanılır.
 * Ham SQL yazılmaz; tüm sorgular Drizzle üzerinden parametreli geçer.
 */
let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function db() {
  if (!cached) {
    cached = drizzle(neon(serverEnv().DATABASE_URL), { schema });
  }
  return cached;
}

export { schema };
