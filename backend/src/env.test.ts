import { EnvironmentValidationError, loadEnv } from './env';

const validEnvironment = {
  NODE_ENV: 'test',
  PORT: '3000',
  MONGO_URI: 'mongodb://localhost:27017/asken-test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters',
  JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: '900',
  REFRESH_TOKEN_TTL_DAYS: '7',
  BCRYPT_ROUNDS: '10',
  COOKIE_SECURE: 'false',
  FRONTEND_URL: 'http://localhost:5173',
  ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost',
  SMTP_PORT: '1025',
  SMTP_USER: 'test@example.com',
  SMTP_PASS: 'password',
};

describe('loadEnv', () => {
  it('parses authentication and cookie settings', () => {
    expect(loadEnv(validEnvironment)).toMatchObject({ NODE_ENV: 'test', PORT: 3000, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false });
  });
  it('rejects weak JWT secrets', () => {
    expect(() => loadEnv({ ...validEnvironment, JWT_ACCESS_SECRET: 'short' })).toThrow(EnvironmentValidationError);
  });
});
