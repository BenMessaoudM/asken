import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { NewsService } from '../types';
import { localeSchema, publicNewsQuerySchema } from '../validation/newsSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}

export function createPublicNewsRouter(newsService: NewsService) {
  const router = Router();
  const list = async (request: { query: Record<string, unknown> }, response: { json: (body: unknown) => void }) => {
    const query = parse(publicNewsQuerySchema, request.query);
    response.json({ data: await newsService.listPublicArticles({
      locale: query.locale, search: query.q, category: query.category, tag: query.tag,
      featured: query.featured, page: query.page, limit: query.limit,
    }) });
  };
  router.get('/', list);
  router.get('/search', list);
  router.get('/categories', async (_request, response) => response.json({ data: { categories: await newsService.listCategories() } }));
  router.get('/:slug', async (request, response) => {
    const locale = parse(localeSchema, request.query.locale);
    response.json({ data: { article: await newsService.getPublicArticle(request.params.slug, locale) } });
  });
  return router;
}
