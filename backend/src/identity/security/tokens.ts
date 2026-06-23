import { createHash, randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { Env } from '../../env';

interface AccessClaims extends jwt.JwtPayload {
  sub: string;
  type: 'access';
}

interface RefreshClaims extends jwt.JwtPayload {
  sub: string;
  sid: string;
  type: 'refresh';
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}

export function issueTokens(userId: string, sessionId: string, env: Env): IssuedTokens {
  const now = Date.now();
  const accessExpiresAt = new Date(now + env.ACCESS_TOKEN_TTL_SECONDS * 1000);
  const refreshExpiresAt = new Date(now + env.REFRESH_TOKEN_TTL_DAYS * 86400000);
  const accessToken = jwt.sign(
    { type: 'access' },
    env.JWT_ACCESS_SECRET,
    { subject: userId, expiresIn: env.ACCESS_TOKEN_TTL_SECONDS, jwtid: randomUUID() },
  );
  const refreshToken = jwt.sign(
    { type: 'refresh', sid: sessionId },
    env.JWT_REFRESH_SECRET,
    { subject: userId, expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`, jwtid: randomUUID() },
  );
  return { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt };
}

export function verifyAccessToken(token: string, env: Env): AccessClaims {
  const claims = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessClaims;
  if (claims.type !== 'access' || !claims.sub) throw new Error('Invalid access token');
  return claims;
}

export function verifyRefreshToken(token: string, env: Env): RefreshClaims {
  const claims = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshClaims;
  if (claims.type !== 'refresh' || !claims.sub || !claims.sid) {
    throw new Error('Invalid refresh token');
  }
  return claims;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
