import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { GovernanceService } from '../types';
import { governanceDocumentQuerySchema, governanceLocaleSchema, slugParamsSchema } from '../validation/governanceSchemas';
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }
const locale = (query: Record<string, unknown>) => parse(governanceLocaleSchema, query).lang;
export function createPublicGovernanceRouter(service: GovernanceService) { const router = Router(); router.get('/', async (request, response) => response.json({ data: await service.overview(locale(request.query)) })); router.get('/documents', async (request, response) => response.json({ data: { documents: await service.listPublicDocuments(parse(governanceDocumentQuerySchema, request.query), locale(request.query)) } })); router.get('/documents/:slug', async (request, response) => response.json({ data: { document: await service.getPublicDocument(parse(slugParamsSchema, request.params).slug, locale(request.query)) } })); router.get('/fullmaktige', async (request, response) => { const filters = parse(governanceDocumentQuerySchema.pick({ year: true }), request.query); response.json({ data: await service.fullmaktige(locale(request.query), filters.year) }); }); return router; }
