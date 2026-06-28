import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { CollaborationService } from '../types';
import { collaborationLocaleSchema, collaborationQuerySchema, slugSchema } from '../validation/collaborationSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }
const locale = (query: Record<string, unknown>) => parse(collaborationLocaleSchema, query.lang || query.locale);

export function createPublicCollaborationRouter(service: CollaborationService) {
  const router = Router();
  router.get('/types', async (request, response) => response.json({ data: { types: await service.listTypes(locale(request.query)) } }));
  router.get('/settings', async (request, response) => response.json({ data: { settings: await service.getPublicSettings(locale(request.query)) } }));
  router.get('/', async (request, response) => {
    const query = parse(collaborationQuerySchema, request.query);
    response.json({ data: { collaborations: await service.listPublic({ type: query.type, featured: query.featured, search: query.search }, query.lang || query.locale || 'sv') } });
  });
  router.get('/:slug', async (request, response) => response.json({ data: { collaboration: await service.getPublicBySlug(parse(slugSchema, request.params.slug), locale(request.query)) } }));
  return router;
}
