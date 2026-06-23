import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { passwordSchema } from '../security/password';
import { IdentityService, RequestContext } from '../types';
import { accessCookieName, clearSessionCookies, refreshCookieName, setSessionCookies } from './cookies';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: passwordSchema });

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}

function context(request: AuthenticatedRequest): RequestContext {
  return { ip: request.ip, userAgent: request.header('user-agent') };
}

export function createAuthRouter(identityService: IdentityService, env: Env) {
  const router = Router();
  const { optionalAuthenticate, requireAuth } = createAuthMiddleware(identityService, env);

  router.post('/login', async (request, response) => {
    const input = parse(loginSchema, request.body);
    const session = await identityService.login(input.email, input.password, context(request));
    setSessionCookies(response, session, env);
    response.status(200).json({ data: { user: session.principal } });
  });

  router.post('/refresh', async (request, response) => {
    const refreshToken = request.cookies?.[refreshCookieName] as string | undefined;
    if (!refreshToken) throw new AppError(401, 'REFRESH_REQUIRED', 'Refresh token is required');
    const session = await identityService.refresh(refreshToken, context(request));
    setSessionCookies(response, session, env);
    response.status(200).json({ data: { user: session.principal } });
  });

  router.post('/logout', optionalAuthenticate, async (request: AuthenticatedRequest, response) => {
    const refreshToken = request.cookies?.[refreshCookieName] as string | undefined;
    await identityService.logout(refreshToken, request.principal, context(request));
    clearSessionCookies(response, env);
    response.status(204).send();
  });

  router.get('/me', requireAuth, (request: AuthenticatedRequest, response) => {
    response.status(200).json({ data: { user: request.principal } });
  });

  router.post('/change-password', requireAuth, async (request: AuthenticatedRequest, response) => {
    const input = parse(changePasswordSchema, request.body);
    await identityService.changePassword(request.principal!.userId, input.currentPassword, input.newPassword, context(request));
    clearSessionCookies(response, env);
    response.status(204).send();
  });

  router.get('/session', optionalAuthenticate, (request: AuthenticatedRequest, response) => {
    response.status(200).json({ data: { authenticated: Boolean(request.principal), user: request.principal || null, cookie: accessCookieName } });
  });

  return router;
}
