import request from 'supertest';
import { createApp } from '../../app';
import { Env } from '../../env';
import { issueTokens } from '../../identity/security/tokens';
import { AuthPrincipal, IdentityService } from '../../identity/types';
import { Collaboration, CollaborationService } from '../types';

const env = { NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://localhost:27017/asken-test', JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters', ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false, FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174', SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin' } satisfies Env;
const principal: AuthPrincipal = { userId: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin', roles: ['super_admin'], permissions: ['collaborations.read', 'collaborations.write'] };
const collaboration: Collaboration = { id: '507f1f77bcf86cd799439091', name: 'ASK Partner', slug: 'ask-partner', type: 'strategic_partner', description: { sv: 'Svensk text', en: '' }, shortDescription: { sv: 'Kort', en: '' }, logoAltText: { sv: '', en: '' }, socialLinks: {}, officeAtCor: true, officeHours: { sv: 'Mån 10.00-12.00', en: '' }, active: true, visible: true, featured: true, displayOrder: 1, tags: { sv: 'partner', en: '' }, createdAt: new Date(), updatedAt: new Date() };
function identity(current: AuthPrincipal = principal): IdentityService { return { login: jest.fn(async () => ({ principal: current, ...issueTokens(current.userId, '507f191e810c19729de860ea', env) })), refresh: jest.fn(), logout: jest.fn(), changePassword: jest.fn(), getPrincipal: jest.fn(async () => current), listUsers: jest.fn(), createUser: jest.fn(), updateUser: jest.fn(), listRoles: jest.fn(), createRole: jest.fn(), updateRolePermissions: jest.fn(), listPermissions: jest.fn() } as unknown as IdentityService; }
function service(): CollaborationService { return { listPublic: jest.fn(async (filters) => filters.type === 'student_nation' ? [] : [{ ...collaboration, typeLabel: 'Partner', description: 'Svensk text', shortDescription: 'Kort', logoAltText: '', officeHours: 'Mån 10.00-12.00', tags: 'partner' }]), getPublicBySlug: jest.fn(async () => ({ ...collaboration, typeLabel: 'Partner', description: 'Svensk text', shortDescription: 'Kort', logoAltText: '', officeHours: 'Mån 10.00-12.00', tags: 'partner' })), listTypes: jest.fn(async () => [{ type: 'strategic_partner', label: 'Partner' }]), getPublicSettings: jest.fn(async () => ({ intro: 'Intro', visible: true, updatedAt: new Date() })), listAdmin: jest.fn(async () => [collaboration]), create: jest.fn(async (input) => ({ ...collaboration, ...input })), update: jest.fn(async (_id, input) => ({ ...collaboration, ...input })), deactivate: jest.fn(async () => undefined), getSettings: jest.fn(async () => ({ id: 'settings', intro: { sv: 'Intro', en: 'Intro' }, visible: true, updatedAt: new Date() })), updateSettings: jest.fn(async (input) => ({ id: 'settings', ...input, updatedAt: new Date() })) } as unknown as CollaborationService; }
function app(current: AuthPrincipal = principal, collaborationsService = service()) { return createApp({ env, identityService: identity(current), cmsService: {} as never, newsService: {} as never, eventService: {} as never, collaborationsService }); }
async function login(application: ReturnType<typeof app>) { return request(application).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'Password1!' }); }

describe('collaboration routes', () => {
  it('serves public list, detail, types, settings and forwards filters', async () => {
    const collaborationsService = service(); const application = app(principal, collaborationsService);
    expect((await request(application).get('/api/v1/collaborations?lang=sv')).body.data.collaborations[0].name).toBe('ASK Partner');
    expect((await request(application).get('/api/v1/collaborations?type=student_nation')).body.data.collaborations).toEqual([]);
    expect(collaborationsService.listPublic).toHaveBeenCalledWith(expect.objectContaining({ type: 'student_nation' }), 'sv');
    expect((await request(application).get('/api/v1/collaborations/ask-partner?lang=en')).body.data.collaboration.description).toBe('Svensk text');
    expect((await request(application).get('/api/v1/collaborations/types?lang=sv')).body.data.types[0].label).toBe('Partner');
    expect((await request(application).get('/api/v1/collaborations/settings')).body.data.settings.visible).toBe(true);
  });

  it('protects admin endpoints and requires collaborations.write for writes', async () => {
    const application = app();
    expect((await request(application).get('/api/v1/admin/collaborations')).status).toBe(401);
    const session = await login(application);
    expect((await request(application).get('/api/v1/admin/collaborations').set('Cookie', session.headers['set-cookie'])).status).toBe(200);
    expect((await request(application).put('/api/v1/admin/collaborations/settings').set('Cookie', session.headers['set-cookie']).send({ intro: { sv: 'Intro', en: 'Intro' }, visible: true })).status).toBe(200);
    const readOnly = app({ ...principal, permissions: ['collaborations.read'] });
    const readOnlySession = await login(readOnly);
    const response = await request(readOnly).post('/api/v1/admin/collaborations').set('Cookie', readOnlySession.headers['set-cookie']).send({ name: 'Partner', type: 'sponsor', description: { sv: 'Text', en: '' }, active: true, visible: true, featured: false, displayOrder: 1 });
    expect(response.status).toBe(403);
  });
});
