import { z } from 'zod';

const booleanFromString = z.preprocess(
  (value) => (typeof value === 'string' ? value === 'true' : value),
  z.boolean(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  MONGO_URI: z.string().trim().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(300).max(3600).default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  COOKIE_SECURE: booleanFromString.default(false),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  ADMIN_URL: z.string().url().default('http://localhost:5174'),
  SMTP_HOST: z.string().trim().min(1),
  SMTP_AUTH: booleanFromString.default(true),
  SMTP_SECURE: booleanFromString.default(false),
  SMTP_PORT: z.coerce.number().int().positive().max(65535),
  SMTP_USER: z.string().trim().min(1),
  SMTP_PASS: z.string().min(1),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_PASSWORD: z.string().optional(),
  SUPER_ADMIN_NAME: z.string().trim().min(1).default('Super Admin'),
});

export type Env = z.infer<typeof envSchema>;

export class EnvironmentValidationError extends Error {
  constructor(public readonly issues: z.ZodIssue[]) {
    super(
      `Invalid environment configuration: ${issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')}`,
    );
    this.name = 'EnvironmentValidationError';
  }
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) throw new EnvironmentValidationError(result.error.issues);
  return result.data;
}

export function validateEnv(source: NodeJS.ProcessEnv = process.env): void {
  loadEnv(source);
}
