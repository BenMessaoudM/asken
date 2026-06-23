import bcrypt from 'bcrypt';
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(12, 'Password must contain at least 12 characters')
  .max(128, 'Password must contain at most 128 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character');

export function validatePassword(password: string): void {
  passwordSchema.parse(password);
}

export function hashPassword(password: string, rounds: number): Promise<string> {
  validatePassword(password);
  return bcrypt.hash(password, rounds);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
