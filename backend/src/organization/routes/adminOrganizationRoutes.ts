import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware } from '../../identity/middleware/auth';
import { IdentityService } from '../../identity/types';
import { OrganizationService } from '../types';
import { alumniInputSchema, committeeInputSchema, eldersCouncilInputSchema, objectIdSchema, personInputSchema, personTypeSchema, recruitmentInputSchema, roleBadgeInputSchema, studentCouncilInputSchema } from '../validation/organizationSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}

export function createAdminOrganizationRouter(service: OrganizationService, identityService: IdentityService, env: Env) {
  const router = Router();
  const { requireAuth, requirePermission } = createAuthMiddleware(identityService, env);
  router.use(requireAuth);

  router.get('/people', requirePermission('organization.read'), async (request, response) => {
    const type = request.query.type ? parse(personTypeSchema, request.query.type) : undefined;
    response.json({ data: { people: await service.listPeople(type) } });
  });
  router.post('/people', requirePermission('organization.write'), async (request, response) => response.status(201).json({ data: { person: await service.createPerson(parse(personInputSchema, request.body) as never) } }));
  router.put('/people/:id', requirePermission('organization.write'), async (request, response) => response.json({ data: { person: await service.updatePerson(parse(objectIdSchema, request.params.id), parse(personInputSchema, request.body) as never) } }));
  router.delete('/people/:id', requirePermission('organization.write'), async (request, response) => { await service.deactivatePerson(parse(objectIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/role-badges', requirePermission('organization.read'), async (_request, response) => response.json({ data: { roleBadges: await service.listRoleBadges() } }));
  router.post('/role-badges', requirePermission('organization.write'), async (request, response) => response.status(201).json({ data: { roleBadge: await service.createRoleBadge(parse(roleBadgeInputSchema, request.body)) } }));
  router.put('/role-badges/:id', requirePermission('organization.write'), async (request, response) => response.json({ data: { roleBadge: await service.updateRoleBadge(parse(objectIdSchema, request.params.id), parse(roleBadgeInputSchema, request.body)) } }));
  router.delete('/role-badges/:id', requirePermission('organization.write'), async (request, response) => { await service.deactivateRoleBadge(parse(objectIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/committees', requirePermission('organization.read'), async (_request, response) => response.json({ data: { committees: await service.listCommittees() } }));
  router.post('/committees', requirePermission('organization.write'), async (request, response) => response.status(201).json({ data: { committee: await service.createCommittee(parse(committeeInputSchema, request.body) as never) } }));
  router.put('/committees/:id', requirePermission('organization.write'), async (request, response) => response.json({ data: { committee: await service.updateCommittee(parse(objectIdSchema, request.params.id), parse(committeeInputSchema, request.body) as never) } }));
  router.delete('/committees/:id', requirePermission('organization.write'), async (request, response) => { await service.deactivateCommittee(parse(objectIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/student-council', requirePermission('organization.read'), async (_request, response) => response.json({ data: { studentCouncil: await service.getStudentCouncil() } }));
  router.put('/student-council', requirePermission('organization.write'), async (request, response) => response.json({ data: { studentCouncil: await service.updateStudentCouncil(parse(studentCouncilInputSchema, request.body) as never) } }));
  router.get('/elders-council', requirePermission('organization.read'), async (_request, response) => response.json({ data: { eldersCouncil: await service.getEldersCouncil() } }));
  router.put('/elders-council', requirePermission('organization.write'), async (request, response) => response.json({ data: { eldersCouncil: await service.updateEldersCouncil(parse(eldersCouncilInputSchema, request.body) as never) } }));

  router.get('/recruitment-campaigns', requirePermission('organization.read'), async (_request, response) => response.json({ data: { campaigns: await service.listRecruitmentCampaigns() } }));
  router.post('/recruitment-campaigns', requirePermission('organization.write'), async (request, response) => response.status(201).json({ data: { campaign: await service.createRecruitmentCampaign(parse(recruitmentInputSchema, request.body) as never) } }));
  router.put('/recruitment-campaigns/:id', requirePermission('organization.write'), async (request, response) => response.json({ data: { campaign: await service.updateRecruitmentCampaign(parse(objectIdSchema, request.params.id), parse(recruitmentInputSchema, request.body) as never) } }));
  router.delete('/recruitment-campaigns/:id', requirePermission('organization.write'), async (request, response) => { await service.deactivateRecruitmentCampaign(parse(objectIdSchema, request.params.id)); response.status(204).send(); });

  router.get('/alumni', requirePermission('organization.read'), async (_request, response) => response.json({ data: { alumni: await service.getAlumni() } }));
  router.put('/alumni', requirePermission('organization.write'), async (request, response) => response.json({ data: { alumni: await service.updateAlumni(parse(alumniInputSchema, request.body) as never) } }));
  return router;
}
