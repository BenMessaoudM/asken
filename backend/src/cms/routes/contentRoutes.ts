import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware, AuthenticatedRequest } from '../../identity/middleware/auth';
import { IdentityService, RequestContext } from '../../identity/types';
import { CmsService } from '../types';
import {
  contentTypeSchema,
  createContentSchema,
  publishContentSchema,
  updateContentSchema,
} from '../validation/contentSchemas';

const contentIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid content identifier');
function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}
function context(request: AuthenticatedRequest): RequestContext {
  return { ip: request.ip, userAgent: request.header('user-agent') };
}

export function createContentRouter(cmsService: CmsService, identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);

  router.get('/', requirePermission('content.read'), async (request, response) => {
    const contentType = request.query.type === undefined ? undefined : parse(contentTypeSchema, request.query.type);
    response.json({ data: { contents: await cmsService.listContents(contentType) } });
  });
  router.post('/', requirePermission('content.write'), async (request: AuthenticatedRequest, response) => {
    const input = parse(createContentSchema, request.body);
    const content = await cmsService.createContent({ ...input, sections: input.sections || [] }, request.principal!, context(request));
    response.status(201).json({ data: { content } });
  });
  router.get('/:contentId', requirePermission('content.read'), async (request, response) => {
    response.json({ data: { content: await cmsService.getContent(parse(contentIdSchema, request.params.contentId)) } });
  });
  router.put('/:contentId', requirePermission('content.write'), async (request: AuthenticatedRequest, response) => {
    const contentId = parse(contentIdSchema, request.params.contentId);
    const input = parse(updateContentSchema, request.body);
    const content = await cmsService.updateContent({ contentId, ...input, sections: input.sections || [] }, request.principal!, context(request));
    response.json({ data: { content } });
  });
  router.delete('/:contentId', requirePermission('content.write'), async (request: AuthenticatedRequest, response) => {
    await cmsService.deleteContent(parse(contentIdSchema, request.params.contentId), request.principal!, context(request));
    response.status(204).send();
  });
  router.post('/:contentId/publish', requirePermission('content.write'), async (request: AuthenticatedRequest, response) => {
    const content = await cmsService.publishContent(
      parse(contentIdSchema, request.params.contentId),
      parse(publishContentSchema, request.body).expectedVersion,
      request.principal!,
      context(request),
    );
    response.json({ data: { content } });
  });
  router.get('/:contentId/versions', requirePermission('content.read'), async (request, response) => {
    response.json({ data: { versions: await cmsService.listVersions(parse(contentIdSchema, request.params.contentId)) } });
  });

  return router;
}
