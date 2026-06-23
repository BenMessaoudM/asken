import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { passwordSchema } from '../security/password';
import { IdentityService, RequestContext } from '../types';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const createUserSchema = z.object({ email: z.string().email(), name: z.string().trim().min(1).max(120), password: passwordSchema, roleIds: z.array(objectId).min(1) });
const updateUserSchema = z.object({ roleIds: z.array(objectId).min(1).optional(), status: z.enum(['active', 'disabled']).optional() }).refine((value) => value.roleIds || value.status, 'At least one field is required');
const createRoleSchema = z.object({ key: z.string().trim().regex(/^[a-z][a-z0-9_.-]{2,49}$/), name: z.string().trim().min(1).max(100), description: z.string().trim().max(500).optional(), permissionIds: z.array(objectId) });
const updatePermissionsSchema = z.object({ permissionIds: z.array(objectId) });

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}
function context(request: AuthenticatedRequest): RequestContext {
  return { ip: request.ip, userAgent: request.header('user-agent') };
}

export function createAdminRouter(identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);

  router.get('/users', requirePermission('users.read'), async (_request, response) => {
    response.json({ data: { users: await identityService.listUsers() } });
  });
  router.post('/users', requirePermission('users.write'), async (request: AuthenticatedRequest, response) => {
    const user = await identityService.createUser(parse(createUserSchema, request.body), request.principal!, context(request));
    response.status(201).json({ data: { user } });
  });
  router.patch('/users/:userId', requirePermission('users.write'), async (request: AuthenticatedRequest, response) => {
    const userId = parse(objectId, request.params.userId);
    const user = await identityService.updateUser({ userId, ...parse(updateUserSchema, request.body) }, request.principal!, context(request));
    response.json({ data: { user } });
  });

  router.get('/roles', requirePermission('roles.read'), async (_request, response) => {
    response.json({ data: { roles: await identityService.listRoles() } });
  });
  router.post('/roles', requirePermission('roles.write'), async (request: AuthenticatedRequest, response) => {
    const role = await identityService.createRole(parse(createRoleSchema, request.body), request.principal!, context(request));
    response.status(201).json({ data: { role } });
  });
  router.put('/roles/:roleId/permissions', requirePermission('roles.write'), async (request: AuthenticatedRequest, response) => {
    const roleId = parse(objectId, request.params.roleId);
    const input = parse(updatePermissionsSchema, request.body);
    const role = await identityService.updateRolePermissions(roleId, input.permissionIds, request.principal!, context(request));
    response.json({ data: { role } });
  });
  router.get('/permissions', requirePermission('roles.read'), async (_request, response) => {
    response.json({ data: { permissions: await identityService.listPermissions() } });
  });

  return router;
}
