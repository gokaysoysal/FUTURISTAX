import { defineConfig } from 'vitest/config';

// Yalnızca saf mantık birim testleri (ör. lib/motion/backdrop-path.ts).
// Next.js/React bileşen testleri kapsamı DIŞINDA — e2e (Playwright) onları
// gerçek tarayıcıda kapsıyor.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
