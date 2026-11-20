import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Os testes mexem no mesmo banco em memória, então rodam um de cada vez.
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    extraHTTPHeaders: { Accept: 'application/json' },
  },
});
