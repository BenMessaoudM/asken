import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { BookingService } from '../types';
import { accessCodeSchema, availabilityQuerySchema, bookingRequestSchema, localeSchema, referenceSchema, resourceSlugSchema } from '../validation/bookingSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }

export function createPublicBookingRouter(service: BookingService) {
  const router = Router();
  router.get('/resources', async (request, response) => { const locale = parse(localeSchema, request.query.locale); response.json({ data: { resources: await service.listPublicResources(locale) } }); });
  router.get('/resources/:slug', async (request, response) => { const locale = parse(localeSchema, request.query.locale); response.json({ data: { resource: await service.getPublicResource(parse(resourceSlugSchema, request.params.slug), locale) } }); });
  router.get('/availability', async (request, response) => { const query = parse(availabilityQuerySchema, request.query); response.json({ data: { intervals: await service.getAvailability(query.resourceId, new Date(query.from), new Date(query.to)) } }); });
  router.post('/', async (request, response) => { const input = parse(bookingRequestSchema, request.body); const result = await service.createBooking({ ...input, startAt: new Date(input.startAt), endAt: new Date(input.endAt) }, { ip: request.ip, userAgent: request.header('user-agent') }); response.status(201).json({ data: result }); });
  router.post('/status', async (request, response) => { const schema = z.object({ reference: referenceSchema, accessCode: accessCodeSchema, locale: localeSchema }); const input = parse(schema, request.body); response.json({ data: { booking: await service.getPublicBooking(input.reference, input.accessCode, input.locale) } }); });
  return router;
}
