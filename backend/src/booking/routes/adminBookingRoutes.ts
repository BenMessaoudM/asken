import { Router } from 'express';
import { z } from 'zod';
import { Env } from '../../env';
import { AppError } from '../../http/errors';
import { createAuthMiddleware, AuthenticatedRequest } from '../../identity/middleware/auth';
import { IdentityService, RequestContext } from '../../identity/types';
import { BookingService } from '../types';
import { adminBookingQuerySchema, bookingIdSchema, bookingResourceSchema, bookingUpdateSchema, resourceIdSchema, statusUpdateSchema } from '../validation/bookingSchemas';

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { const result = schema.safeParse(value); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()); return result.data; }
function context(request: AuthenticatedRequest): RequestContext { return { ip: request.ip, userAgent: request.header('user-agent') }; }
function resourceInput(input: z.infer<typeof bookingResourceSchema>) { return { ...input, imageUrl: input.imageUrl || undefined, blackoutPeriods: input.blackoutPeriods.map((period) => ({ ...period, startAt: new Date(period.startAt), endAt: new Date(period.endAt) })) }; }

export function createAdminBookingRouter(service: BookingService, identity: IdentityService, env: Env) {
  const router = Router(); const { requireAuth, requirePermission } = createAuthMiddleware(identity, env); router.use(requireAuth);
  router.get('/resources', requirePermission('booking.read'), async (_request, response) => response.json({ data: { resources: await service.listAdminResources() } }));
  router.post('/resources', requirePermission('booking.write'), async (request: AuthenticatedRequest, response) => response.status(201).json({ data: { resource: await service.createResource(resourceInput(parse(bookingResourceSchema, request.body)), request.principal!, context(request)) } }));
  router.put('/resources/:id', requirePermission('booking.write'), async (request: AuthenticatedRequest, response) => response.json({ data: { resource: await service.updateResource(parse(resourceIdSchema, request.params.id), resourceInput(parse(bookingResourceSchema, request.body)), request.principal!, context(request)) } }));
  router.get('/', requirePermission('booking.read'), async (request, response) => { const query = parse(adminBookingQuerySchema, request.query); response.json({ data: { bookings: await service.listBookings({ ...query, from: query.from ? new Date(query.from) : undefined, to: query.to ? new Date(query.to) : undefined }) } }); });
  router.get('/:id', requirePermission('booking.read'), async (request, response) => response.json({ data: { booking: await service.getBooking(parse(bookingIdSchema, request.params.id)) } }));
  router.put('/:id', requirePermission('booking.write'), async (request: AuthenticatedRequest, response) => { const input = parse(bookingUpdateSchema, request.body); response.json({ data: { booking: await service.updateBooking(parse(bookingIdSchema, request.params.id), { ...input, startAt: input.startAt ? new Date(input.startAt) : undefined, endAt: input.endAt ? new Date(input.endAt) : undefined }, request.principal!, context(request)) } }); });
  router.post('/:id/status', requirePermission('booking.write'), async (request: AuthenticatedRequest, response) => { const input = parse(statusUpdateSchema, request.body); response.json({ data: { booking: await service.setBookingStatus(parse(bookingIdSchema, request.params.id), input.status, input.note, request.principal!, context(request)) } }); });
  router.get('/:id/history', requirePermission('booking.read'), async (request, response) => response.json({ data: { history: await service.listHistory(parse(bookingIdSchema, request.params.id)) } }));
  return router;
}
