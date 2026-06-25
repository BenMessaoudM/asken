import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { CmsService } from '../types';

const pageSlugSchema = z.string().trim().min(1).max(120).regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Page slug must contain lowercase letters, numbers, and hyphens',
);

export function createPublicContentRouter(cmsService: CmsService) {
  const router = Router();

  router.get('/:slug', async (request, response) => {
    const result = pageSlugSchema.safeParse(request.params.slug);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
    }
    response.setHeader('cache-control', 'public, max-age=60, stale-while-revalidate=300');
    response.json({ data: { page: await cmsService.getPublishedPage(result.data) } });
  });

  return router;
}
