import { CorsOptions } from 'cors';
import { Env } from '../env';

export const localDevelopmentOrigins = [
  'http://127.0.0.1:5174',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
] as const;

export function getAllowedOrigins(env: Env): string[] {
  const configured = [env.FRONTEND_URL, env.ADMIN_URL];
  return [...new Set(env.NODE_ENV === 'development'
    ? [...configured, ...localDevelopmentOrigins]
    : configured)];
}

export function createCorsOptions(env: Env): CorsOptions {
  const allowedOrigins = new Set(getAllowedOrigins(env));
  return {
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  };
}
