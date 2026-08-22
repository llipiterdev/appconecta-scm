import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'reports/playwright', open: 'never' }]]
    : [['list']],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'movil',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Las pruebas se ejecutan contra el build de produccion, no contra el servidor de
  // desarrollo: verificar un artefacto distinto del que se despliega no demostraria nada
  // sobre el artefacto desplegado.
  webServer: {
    command: `npx vite preview --port ${port} --strictPort --host 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
