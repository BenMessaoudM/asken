import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware } from '../../identity/middleware/auth';
import { IdentityService } from '../../identity/types';
import { CollaborationService } from '../types';
import { collaborationInputSchema, collaborationQuerySchema, objectIdSchema, settingsInputSchema } from '../validation/collaborationSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }

export function createAdminCollaborationRouter(service: CollaborationService, identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);
  router.get('/settings', requirePermission('collaborations.read'), async (_request, response) => response.json({ data: { settings: await service.getSettings() } }));
  router.put('/settings', requirePermission('collaborations.write'), async (request, response) => response.json({ data: { settings: await service.updateSettings(parse(settingsInputSchema, request.body)) } }));
  router.get('/', requirePermission('collaborations.read'), async (request, response) => {
    const query = parse(collaborationQuerySchema, request.query);
    response.json({ data: { collaborations: await service.listAdmin({ type: query.type, featured: query.featured, active: query.active, visible: query.visible, search: query.search }) } });
  });
  router.post('/', requirePermission('collaborations.write'), async (request, response) => response.status(201).json({ data: { collaboration: await service.create(parse(collaborationInputSchema, request.body) as never) } }));
  router.put('/:id', requirePermission('collaborations.write'), async (request, response) => response.json({ data: { collaboration: await service.update(parse(objectIdSchema, request.params.id), parse(collaborationInputSchema, request.body) as never) } }));
  router.delete('/:id', requirePermission('collaborations.write'), async (request, response) => { await service.deactivate(parse(objectIdSchema, request.params.id)); response.status(204).send(); });
  return router;
}
