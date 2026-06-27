import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { RepresentativesService } from '../types';
import { representativeLocaleSchema, representativeSlugSchema } from '../validation/representativeSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}

const locale = (query: Record<string, unknown>) => parse(representativeLocaleSchema, query).lang;

export function createPublicRepresentativeRouter(service: RepresentativesService) {
  const router = Router();
  router.get('/bodies', async (request, response) => response.json({ data: { bodies: await service.listPublicBodies(locale(request.query)) } }));
  router.get('/bodies/:slug', async (request, response) => response.json({ data: await service.getPublicBody(parse(representativeSlugSchema, request.params).slug, locale(request.query)) }));
  router.get('/current', async (request, response) => response.json({ data: { groups: await service.listCurrentRepresentatives(locale(request.query)) } }));
  router.get('/calls', async (request, response) => response.json({ data: { calls: await service.listPublicCalls(locale(request.query)) } }));
  return router;
}
