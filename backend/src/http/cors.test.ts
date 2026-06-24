import { Env } from '../env';
import { createCorsOptions, getAllowedOrigins } from './cors';

const baseEnv = {
  NODE_ENV: 'development', PORT: 3000, MONGO_URI: 'mongodb://localhost/test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'https://public.example.com', ADMIN_URL: 'https://admin.example.com',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025,
  SMTP_USER: 'dev@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin',
} satisfies Env;

describe('CORS origin allowlist', () => {
  it('allows localhost and loopback origins in development', () => {
    expect(getAllowedOrigins(baseEnv)).toEqual(expect.arrayContaining([
      'http://127.0.0.1:5174', 'http://localhost:5174',
      'http://127.0.0.1:5173', 'http://localhost:5173',
    ]));
  });

  it('does not add local origins in production', () => {
    expect(getAllowedOrigins({ ...baseEnv, NODE_ENV: 'production' })).toEqual([
      'https://public.example.com', 'https://admin.example.com',
    ]);
  });

  it('terminates successful preflight requests with 204', () => {
    expect(createCorsOptions(baseEnv)).toMatchObject({
      credentials: true,
      optionsSuccessStatus: 204,
      preflightContinue: false,
    });
  });
});
