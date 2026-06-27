import request from 'supertest';
import { createApp } from '../../app';
import { Env } from '../../env';
import { issueTokens } from '../../identity/security/tokens';
import { AuthPrincipal, IdentityService } from '../../identity/types';
import { RepresentativesService } from '../types';

const env = {
  NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://localhost:27017/asken-test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin',
} satisfies Env;
const principal: AuthPrincipal = { userId: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin', roles: ['super_admin'], permissions: ['representatives.read', 'representatives.write'] };
function identity(current: AuthPrincipal = principal): IdentityService {
  return { login: jest.fn(async () => ({ principal: current, ...issueTokens(current.userId, '507f191e810c19729de860ea', env) })), refresh: jest.fn(), logout: jest.fn(), changePassword: jest.fn(), getPrincipal: jest.fn(async () => current), listUsers: jest.fn(), createUser: jest.fn(), updateUser: jest.fn(), listRoles: jest.fn(), createRole: jest.fn(), updateRolePermissions: jest.fn(), listPermissions: jest.fn() } as unknown as IdentityService;
}
const body = { id: 'body-1', name: 'Yrkeshögskolans styrelse', slug: 'yrkeshogskolans-styrelse', description: 'ASK väljer studeranderepresentant.', category: 'statutory_arcada_body' as const, appointingBody: 'fullmaktige' as const, defaultTermLengthMonths: 24, defaultSeatCount: 1, eligibilityDescription: 'Valbarhet enligt stadgar.', applicationInstructions: 'Ansök enligt utlysningen.' };
const adminBody = { ...body, name: { sv: body.name, en: 'Board of the University of Applied Sciences' }, description: { sv: body.description, en: 'Student representative body.' }, eligibilityDescription: { sv: body.eligibilityDescription, en: 'Eligibility by statutes.' }, applicationInstructions: { sv: body.applicationInstructions, en: 'Apply according to the call.' }, active: true, visible: true, displayOrder: 10, createdAt: new Date(), updatedAt: new Date() };
const call = { id: 'call-1', title: 'Ansök', bodyId: body.id, body, description: 'Öppen utlysning', openingDate: new Date('2026-08-01T00:00:00Z'), closingDate: new Date('2026-08-15T00:00:00Z'), numberOfSeats: 1, eligibility: 'Valbar', applicationInstructions: 'Skicka ansökan', ctaLabel: 'Ansök', ctaUrl: 'mailto:info@asken.fi', contactEmail: 'info@asken.fi', status: 'open' as const, featured: false, displayOrder: 1 };
function service(): RepresentativesService {
  return { listPublicBodies: jest.fn(async () => [body]), getPublicBody: jest.fn(async () => ({ body, representatives: [], calls: [call] })), listCurrentRepresentatives: jest.fn(async () => [{ body, representatives: [] }]), listPublicCalls: jest.fn(async () => [call]), listBodies: jest.fn(async () => [adminBody]), createBody: jest.fn(async (input) => ({ ...adminBody, ...input, id: 'created-body' })), updateBody: jest.fn(async (_id, input) => ({ ...adminBody, ...input })), deactivateBody: jest.fn(async () => undefined), listRepresentatives: jest.fn(async () => []), createRepresentative: jest.fn(), updateRepresentative: jest.fn(), deactivateRepresentative: jest.fn(), listCalls: jest.fn(async () => []), createCall: jest.fn(), updateCall: jest.fn(), deactivateCall: jest.fn() } as unknown as RepresentativesService;
}
function app(current: AuthPrincipal = principal, representativesService = service()) { return createApp({ env, identityService: identity(current), cmsService: {} as never, newsService: {} as never, eventService: {} as never, representativesService }); }

async function login(application: ReturnType<typeof app>) {
  return request(application).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'Password1!' });
}

describe('representatives routes', () => {
  it('serves public bodies, body details, current representatives, and calls', async () => {
    const application = app();
    expect((await request(application).get('/api/v1/representatives/bodies?lang=sv')).body.data.bodies[0].name).toBe('Yrkeshögskolans styrelse');
    expect((await request(application).get('/api/v1/representatives/bodies/yrkeshogskolans-styrelse?lang=sv')).body.data.calls[0].status).toBe('open');
    expect((await request(application).get('/api/v1/representatives/current?lang=sv')).status).toBe(200);
    expect((await request(application).get('/api/v1/representatives/calls?lang=sv')).body.data.calls[0].ctaLabel).toBe('Ansök');
  });

  it('protects admin routes and enforces representatives.write', async () => {
    const application = app();
    expect((await request(application).get('/api/v1/admin/representatives/bodies')).status).toBe(401);
    const session = await login(application);
    expect((await request(application).get('/api/v1/admin/representatives/bodies').set('Cookie', session.headers['set-cookie'])).status).toBe(200);

    const readOnly = app({ ...principal, permissions: ['representatives.read'] });
    const readOnlySession = await login(readOnly);
    const response = await request(readOnly).post('/api/v1/admin/representatives/bodies').set('Cookie', readOnlySession.headers['set-cookie']).send({ ...adminBody, slug: 'new-body' });
    expect(response.status).toBe(403);
  });
});
