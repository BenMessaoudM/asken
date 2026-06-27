import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { OrganizationService } from '../types';
import { organizationLocaleSchema } from '../validation/organizationSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten());
  return result.data;
}
const locale = (query: Record<string, unknown>) => parse(organizationLocaleSchema, query.locale);

export function createPublicOrganizationRouter(service: OrganizationService) {
  const router = Router();
  router.get('/', async (request, response) => response.json({ data: await service.overview(locale(request.query)) }));
  router.get('/board', async (request, response) => response.json({ data: { people: await service.listPublicPeople('board', locale(request.query)) } }));
  router.get('/staff', async (request, response) => response.json({ data: { people: await service.listPublicPeople('staff', locale(request.query)) } }));
  router.get('/committees', async (request, response) => response.json({ data: { committees: await service.listPublicCommittees(locale(request.query)) } }));
  router.get('/student-council', async (request, response) => response.json({ data: { studentCouncil: await service.getPublicStudentCouncil(locale(request.query)) } }));
  router.get('/elders-council', async (request, response) => response.json({ data: { eldersCouncil: await service.getPublicEldersCouncil(locale(request.query)) } }));
  router.get('/get-involved', async (request, response) => response.json({ data: { campaigns: await service.listPublicRecruitmentCampaigns(locale(request.query)) } }));
  router.get('/alumni', async (request, response) => response.json({ data: { alumni: await service.getPublicAlumni(locale(request.query)) } }));
  return router;
}
