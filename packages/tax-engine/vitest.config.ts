import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/calculators/**', 'src/calendar/**'],
      thresholds: { lines: 95, functions: 95, branches: 85, statements: 95 },
    },
  },
});
