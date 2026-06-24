import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware, AuthenticatedRequest } from '../../identity/middleware/auth';
import { IdentityService, RequestContext } from '../../identity/types';
import { NewsService } from '../types';
import {
  articleIdSchema,
  articleInputSchema,
  featuredSchema,
  publishArticleSchema,
  taxonomySchema,
  updateArticleSchema,
} from '../validation/newsSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}
function context(request: AuthenticatedRequest): RequestContext {
  return { ip: request.ip, userAgent: request.header('user-agent') };
}

export function createAdminNewsRouter(newsService: NewsService, identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);

  router.get('/categories', requirePermission('news.read'), async (_request, response) => response.json({ data: { categories: await newsService.listCategories() } }));
  router.post('/categories', requirePermission('news.write'), async (request, response) => response.status(201).json({ data: { category: await newsService.createCategory(parse(taxonomySchema, request.body)) } }));
  router.put('/categories/:id', requirePermission('news.write'), async (request, response) => response.json({ data: { category: await newsService.updateCategory(parse(articleIdSchema, request.params.id), parse(taxonomySchema, request.body)) } }));
  router.delete('/categories/:id', requirePermission('news.write'), async (request, response) => { await newsService.deleteCategory(parse(articleIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/tags', requirePermission('news.read'), async (_request, response) => response.json({ data: { tags: await newsService.listTags() } }));
  router.post('/tags', requirePermission('news.write'), async (request, response) => response.status(201).json({ data: { tag: await newsService.createTag(parse(taxonomySchema, request.body)) } }));
  router.put('/tags/:id', requirePermission('news.write'), async (request, response) => response.json({ data: { tag: await newsService.updateTag(parse(articleIdSchema, request.params.id), parse(taxonomySchema, request.body)) } }));
  router.delete('/tags/:id', requirePermission('news.write'), async (request, response) => { await newsService.deleteTag(parse(articleIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/', requirePermission('news.read'), async (_request, response) => response.json({ data: { articles: await newsService.listAdminArticles() } }));
  router.post('/', requirePermission('news.write'), async (request: AuthenticatedRequest, response) => {
    const article = await newsService.createArticle(parse(articleInputSchema, request.body), request.principal!, context(request));
    response.status(201).json({ data: { article } });
  });
  router.get('/:articleId', requirePermission('news.read'), async (request, response) => response.json({ data: { article: await newsService.getAdminArticle(parse(articleIdSchema, request.params.articleId)) } }));
  router.put('/:articleId', requirePermission('news.write'), async (request: AuthenticatedRequest, response) => {
    const article = await newsService.updateArticle(parse(articleIdSchema, request.params.articleId), parse(updateArticleSchema, request.body), request.principal!, context(request));
    response.json({ data: { article } });
  });
  router.delete('/:articleId', requirePermission('news.write'), async (request: AuthenticatedRequest, response) => {
    await newsService.deleteArticle(parse(articleIdSchema, request.params.articleId), request.principal!, context(request));
    response.status(204).send();
  });
  router.post('/:articleId/publish', requirePermission('news.write'), async (request: AuthenticatedRequest, response) => {
    const input = parse(publishArticleSchema, request.body);
    const article = await newsService.publishArticle(parse(articleIdSchema, request.params.articleId), input.expectedVersion, input.publishAt ? new Date(input.publishAt) : undefined, request.principal!, context(request));
    response.json({ data: { article } });
  });
  router.patch('/:articleId/featured', requirePermission('news.write'), async (request: AuthenticatedRequest, response) => {
    const article = await newsService.setFeatured(parse(articleIdSchema, request.params.articleId), parse(featuredSchema, request.body).featured, request.principal!, context(request));
    response.json({ data: { article } });
  });

  return router;
}
