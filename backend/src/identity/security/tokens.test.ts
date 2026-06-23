import { Env } from '../../env';
import { hashToken, issueTokens, verifyAccessToken, verifyRefreshToken } from './tokens';

const env = {
  NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin'
} satisfies Env;

describe('JWT security', () => {
  it('issues separate access and refresh token types', () => {
    const tokens = issueTokens('507f1f77bcf86cd799439011', '507f191e810c19729de860ea', env);
    expect(verifyAccessToken(tokens.accessToken, env).type).toBe('access');
    expect(verifyRefreshToken(tokens.refreshToken, env).sid).toBe('507f191e810c19729de860ea');
    expect(() => verifyAccessToken(tokens.refreshToken, env)).toThrow();
  });
  it('hashes refresh tokens deterministically', () => {
    expect(hashToken('token')).toBe(hashToken('token'));
    expect(hashToken('token')).not.toBe('token');
  });
});
