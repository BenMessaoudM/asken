import { randomUUID } from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CmsService } from './cms/types';
import { createAdminNewsRouter } from './news/routes/adminNewsRoutes';
import { createPublicNewsRouter } from './news/routes/publicNewsRoutes';
import { NewsService } from './news/types';
import { EventService } from './events/types';
import { createAdminEventRouter } from './events/routes/adminEventRoutes';
import { createPublicEventRouter } from './events/routes/publicEventRoutes';
import { createContentRouter } from './cms/routes/contentRoutes';
import { createPublicContentRouter } from './cms/routes/publicContentRoutes';
import { Env } from './env';
import { createCorsOptions } from './http/cors';
import { AppError, errorHandler, notFoundHandler } from './http/errors';
import { createAuthMiddleware } from './identity/middleware/auth';
import { createAdminRouter } from './identity/routes/adminRoutes';
import { createAuthRouter } from './identity/routes/authRoutes';
import { IdentityService } from './identity/types';
import { BookingService } from './booking/types';
import { createPublicBookingRouter } from './booking/routes/publicBookingRoutes';
import { createAdminBookingRouter } from './booking/routes/adminBookingRoutes';
import { OrganizationService } from './organization/types';
import { createAdminOrganizationRouter } from './organization/routes/adminOrganizationRoutes';
import { createPublicOrganizationRouter } from './organization/routes/publicOrganizationRoutes';
import { RepresentativesService } from './representatives/types';
import { createAdminRepresentativeRouter } from './representatives/routes/adminRepresentativeRoutes';
import { createPublicRepresentativeRouter } from './representatives/routes/publicRepresentativeRoutes';
import { GovernanceService } from './governance/types';
import { createAdminGovernanceRouter } from './governance/routes/adminGovernanceRoutes';
import { createPublicGovernanceRouter } from './governance/routes/publicGovernanceRoutes';

export interface AppDependencies {
  env: Env;
  identityService: IdentityService;
  cmsService: CmsService;
  newsService: NewsService;
  eventService: EventService;
  bookingService?: BookingService;
  organizationService?: OrganizationService;
  representativesService?: RepresentativesService;
  governanceService?: GovernanceService;
  isReady?: () => boolean;
  sendMessage?: (message: string) => Promise<void>;
}

const messageSchema = z.object({ message: z.string().trim().min(1).max(5000) });

export function createApp({
  env,
  identityService,
  cmsService,
  newsService,
  eventService,
  bookingService,
  organizationService,
  representativesService,
  governanceService,
  isReady = () => mongoose.connection.readyState === 1,
  sendMessage = async () => undefined,
}: AppDependencies) {
  const app = express();
  const { requireAuth } = createAuthMiddleware(identityService, env);

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(createCorsOptions(env)));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use((request, response, next) => {
    const requestId = request.header('x-request-id') || randomUUID();
    response.locals.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    next();
  });

  app.get('/api/v1/health', (_request, response) => {
    response.status(200).json({ data: { status: 'ok', service: 'asken-backend', apiVersion: 'v1' } });
  });
  app.get('/api/v1/readiness', (_request, response) => {
    const ready = isReady();
    response.status(ready ? 200 : 503).json({ data: { status: ready ? 'ready' : 'not_ready', dependencies: { database: ready ? 'connected' : 'disconnected' } } });
  });

  app.use(
    '/api/v1/auth',
    rateLimit({ windowMs: 15 * 60 * 1000, limit: env.NODE_ENV === 'test' ? 1000 : 100, standardHeaders: 'draft-8', legacyHeaders: false }),
    createAuthRouter(identityService, env),
  );
  app.use('/api/v1/admin/content', createContentRouter(cmsService, identityService, env));
  app.use('/api/v1/pages', createPublicContentRouter(cmsService));
  app.use('/api/v1/admin/news', createAdminNewsRouter(newsService, identityService, env));
  app.use('/api/v1/news', createPublicNewsRouter(newsService));
  app.use('/api/v1/admin/events', createAdminEventRouter(eventService, identityService, env));
  app.use('/api/v1/events', createPublicEventRouter(eventService));
  if (bookingService) {
    app.use('/api/v1/bookings', rateLimit({ windowMs: 15 * 60 * 1000, limit: env.NODE_ENV === 'test' ? 1000 : 60, standardHeaders: 'draft-8', legacyHeaders: false }), createPublicBookingRouter(bookingService));
    app.use('/api/v1/admin/bookings', createAdminBookingRouter(bookingService, identityService, env));
  }
  if (organizationService) {
    app.use('/api/v1/organization', createPublicOrganizationRouter(organizationService));
    app.use('/api/public/organization', createPublicOrganizationRouter(organizationService));
    app.use('/api/v1/admin/organization', createAdminOrganizationRouter(organizationService, identityService, env));
    app.use('/api/admin/organization', createAdminOrganizationRouter(organizationService, identityService, env));
  }
  if (representativesService) {
    app.use('/api/v1/representatives', createPublicRepresentativeRouter(representativesService));
    app.use('/api/public/representatives', createPublicRepresentativeRouter(representativesService));
    app.use('/api/v1/admin/representatives', createAdminRepresentativeRouter(representativesService, identityService, env));
    app.use('/api/admin/representatives', createAdminRepresentativeRouter(representativesService, identityService, env));
  }
  if (governanceService) {
    app.use('/api/v1/governance', createPublicGovernanceRouter(governanceService));
    app.use('/api/public/governance', createPublicGovernanceRouter(governanceService));
    app.use('/api/v1/admin/governance', createAdminGovernanceRouter(governanceService, identityService, env));
    app.use('/api/admin/governance', createAdminGovernanceRouter(governanceService, identityService, env));
  }
  app.use('/api/v1/admin', createAdminRouter(identityService, env));

  const messageHandler = async (request: Request, response: Response, next: NextFunction) => {
    const result = messageSchema.safeParse(request.body);
    if (!result.success) return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()));
    try {
      await sendMessage(result.data.message);
      return response.status(200).json({ data: { status: 'sent' } });
    } catch {
      return next(new AppError(502, 'EMAIL_DELIVERY_FAILED', 'Message delivery failed'));
    }
  };
  app.post('/api/v1/messages', requireAuth, messageHandler);
  app.post('/message', requireAuth, (request, response, next) => {
    response.setHeader('deprecation', 'true');
    response.setHeader('link', '</api/v1/messages>; rel="successor-version"');
    return messageHandler(request, response, next);
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
