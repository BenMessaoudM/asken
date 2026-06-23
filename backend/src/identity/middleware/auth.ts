import { NextFunction, Request, Response } from 'express';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { verifyAccessToken } from '../security/tokens';
import { AuthPrincipal, IdentityService } from '../types';

export interface AuthenticatedRequest extends Request {
  principal?: AuthPrincipal;
}

function getAccessToken(request: Request): string | undefined {
  const cookieToken = request.cookies?.ask_access as string | undefined;
  if (cookieToken) return cookieToken;
  const authorization = request.header('authorization');
  if (!authorization) return undefined;
  if (!authorization.startsWith('Bearer ')) {
    throw new AppError(401, 'INVALID_AUTH_FORMAT', 'Authorization must use Bearer format');
  }
  return authorization.slice('Bearer '.length).trim();
}

export function createAuthMiddleware(identityService: IdentityService, env: Env) {
  const optionalAuthenticate = async (
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction,
  ) => {
    const token = getAccessToken(request);
    if (!token) return next();
    try {
      const claims = verifyAccessToken(token, env);
      const principal = await identityService.getPrincipal(claims.sub);
      if (principal) request.principal = principal;
      return next();
    } catch {
      return next();
    }
  };

  const requireAuth = async (
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction,
  ) => {
    let token: string | undefined;
    try {
      token = getAccessToken(request);
    } catch (error) {
      return next(error);
    }
    if (!token) return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required'));
    try {
      const claims = verifyAccessToken(token, env);
      const principal = await identityService.getPrincipal(claims.sub);
      if (!principal) return next(new AppError(401, 'SESSION_REVOKED', 'Session is no longer valid'));
      request.principal = principal;
      return next();
    } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(401, 'INVALID_TOKEN', 'Authentication token is invalid or expired'));
    }
  };

  const requirePermission = (permission: string) => (
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction,
  ) => {
    if (!request.principal) return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required'));
    if (!request.principal.permissions.includes(permission)) {
      return next(new AppError(403, 'PERMISSION_DENIED', 'You do not have permission to perform this action'));
    }
    return next();
  };

  return { optionalAuthenticate, requireAuth, requirePermission };
}
