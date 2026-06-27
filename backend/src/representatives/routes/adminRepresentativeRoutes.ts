import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware } from '../../identity/middleware/auth';
import { IdentityService } from '../../identity/types';
import { RepresentativesService } from '../types';
import { representativeBodyInputSchema, representativeCallInputSchema, studentRepresentativeInputSchema } from '../validation/representativeSchemas';

const idSchema = z.string().trim().min(1);

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}

export function createAdminRepresentativeRouter(service: RepresentativesService, identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);

  router.get('/bodies', requirePermission('representatives.read'), async (_request, response) => response.json({ data: { bodies: await service.listBodies() } }));
  router.post('/bodies', requirePermission('representatives.write'), async (request, response) => response.status(201).json({ data: { body: await service.createBody(parse(representativeBodyInputSchema, request.body) as never) } }));
  router.put('/bodies/:id', requirePermission('representatives.write'), async (request, response) => response.json({ data: { body: await service.updateBody(parse(idSchema, request.params.id), parse(representativeBodyInputSchema, request.body) as never) } }));
  router.delete('/bodies/:id', requirePermission('representatives.write'), async (request, response) => {
    await service.deactivateBody(parse(idSchema, request.params.id));
    response.status(204).send();
  });

  router.get('/people', requirePermission('representatives.read'), async (_request, response) => response.json({ data: { representatives: await service.listRepresentatives() } }));
  router.post('/people', requirePermission('representatives.write'), async (request, response) => response.status(201).json({ data: { representative: await service.createRepresentative(parse(studentRepresentativeInputSchema, request.body) as never) } }));
  router.put('/people/:id', requirePermission('representatives.write'), async (request, response) => response.json({ data: { representative: await service.updateRepresentative(parse(idSchema, request.params.id), parse(studentRepresentativeInputSchema, request.body) as never) } }));
  router.delete('/people/:id', requirePermission('representatives.write'), async (request, response) => {
    await service.deactivateRepresentative(parse(idSchema, request.params.id));
    response.status(204).send();
  });

  router.get('/calls', requirePermission('representatives.read'), async (_request, response) => response.json({ data: { calls: await service.listCalls() } }));
  router.post('/calls', requirePermission('representatives.write'), async (request, response) => response.status(201).json({ data: { call: await service.createCall(parse(representativeCallInputSchema, request.body) as never) } }));
  router.put('/calls/:id', requirePermission('representatives.write'), async (request, response) => response.json({ data: { call: await service.updateCall(parse(idSchema, request.params.id), parse(representativeCallInputSchema, request.body) as never) } }));
  router.delete('/calls/:id', requirePermission('representatives.write'), async (request, response) => {
    await service.deactivateCall(parse(idSchema, request.params.id));
    response.status(204).send();
  });

  return router;
}
