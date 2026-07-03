import { defineConfig, devices } from '@playwright/test'

const backendEnv = {
  NODE_ENV: 'test',
  PORT: '3000',
  MONGO_URI: process.env.E2E_MONGO_URI || 'mongodb://127.0.0.1:27017/asken-e2e',
  JWT_ACCESS_SECRET: 'e2e-access-secret-with-at-least-32-characters',
  JWT_REFRESH_SECRET: 'e2e-refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: '900',
  REFRESH_TOKEN_TTL_DAYS: '7',
  BCRYPT_ROUNDS: '10',
  COOKIE_SECURE: 'false',
  FRONTEND_URL: 'http://127.0.0.1:5173',
  ADMIN_URL: 'http://127.0.0.1:5174',
  SMTP_HOST: '127.0.0.1',
  SMTP_AUTH: 'false',
  SMTP_SECURE: 'false',
  SMTP_PORT: '1025',
  SMTP_USER: 'e2e@example.com',
  SMTP_PASS: 'e2e-password',
  SUPER_ADMIN_EMAIL: 'e2e-admin@example.com',
  SUPER_ADMIN_PASSWORD: 'StrongPassword1!',
  SUPER_ADMIN_NAME: 'E2E Admin',
}

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'mongosh "$MONGO_URI" --quiet --eval "db.dropDatabase()" && npm run migrate && npm run seed && npm run dev',
      cwd: 'backend',
      env: backendEnv,
      url: 'http://127.0.0.1:3000/api/v1/health',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: 'frontend',
      env: { VITE_API_URL: 'http://127.0.0.1:3000/api/v1' },
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174',
      cwd: 'admin',
      env: { VITE_API_URL: 'http://127.0.0.1:3000/api/v1' },
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
})
