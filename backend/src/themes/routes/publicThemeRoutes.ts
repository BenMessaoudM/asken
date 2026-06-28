import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { ThemeService } from '../types';
import { themeLocaleSchema } from '../validation/themeSchemas';
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }
const locale = (query: Record<string, unknown>) => parse(themeLocaleSchema, query.lang || query.locale);
export function createPublicThemeRouter(service: ThemeService) { const router = Router(); router.get('/active', async (request, response) => response.json({ data: { theme: await service.getPublicActive(locale(request.query)) } })); router.get('/public', async (request, response) => response.json({ data: { theme: await service.getPublicActive(locale(request.query)) } })); return router; }
