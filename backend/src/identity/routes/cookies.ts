import { CookieOptions, Response } from 'express';
import { Env } from '../../env';
import { AuthSession } from '../types';

export const accessCookieName = 'ask_access';
export const refreshCookieName = 'ask_refresh';

function baseCookieOptions(env: Env): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
}

export function setSessionCookies(response: Response, session: AuthSession, env: Env) {
  response.cookie(accessCookieName, session.accessToken, {
    ...baseCookieOptions(env),
    path: '/',
    expires: session.accessExpiresAt,
  });
  response.cookie(refreshCookieName, session.refreshToken, {
    ...baseCookieOptions(env),
    path: '/api/v1/auth',
    expires: session.refreshExpiresAt,
  });
}

export function clearSessionCookies(response: Response, env: Env) {
  response.clearCookie(accessCookieName, { ...baseCookieOptions(env), path: '/' });
  response.clearCookie(refreshCookieName, {
    ...baseCookieOptions(env),
    path: '/api/v1/auth',
  });
}
