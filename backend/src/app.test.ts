import request from 'supertest';
import { createApp } from './app';
import { CmsService, ManagedContent } from './cms/types';
import { Env } from './env';
import { issueTokens } from './identity/security/tokens';
import { AuthPrincipal, IdentityService } from './identity/types';

const env = {
  NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://localhost:27017/asken-test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin',
} satisfies Env;

const adminPrincipal: AuthPrincipal = {
  userId: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin',
  roles: ['super_admin'], permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'content.read', 'content.write'],
};

const sampleContent: ManagedContent = {
  id: '507f1f77bcf86cd799439021', contentType: 'page', title: 'About ASK', slug: 'about-ask',
  status: 'draft', version: 1,
  sections: [{ id: '507f1f77bcf86cd799439022', type: 'text', position: 0, data: { body: 'About us' } }],
  createdAt: new Date(), updatedAt: new Date(),
};

function createIdentityService(principal: AuthPrincipal = adminPrincipal): IdentityService {
  const createSession = () => ({ principal, ...issueTokens(principal.userId, '507f191e810c19729de860ea', env) });
  return {
    login: jest.fn(async () => createSession()), refresh: jest.fn(async () => createSession()),
    logout: jest.fn(async () => undefined), getPrincipal: jest.fn(async (userId) => userId === principal.userId ? principal : null),
    changePassword: jest.fn(async () => undefined),
    listUsers: jest.fn(async () => [{ id: principal.userId, email: principal.email, name: principal.name, status: 'active' as const, roles: [{ id: '507f191e810c19729de860eb', key: 'super_admin', name: 'Super Admin' }], createdAt: new Date(), updatedAt: new Date() }]),
    createUser: jest.fn(async (input) => ({ id: '507f1f77bcf86cd799439012', email: input.email, name: input.name, status: 'active' as const, roles: [], createdAt: new Date(), updatedAt: new Date() })),
    updateUser: jest.fn(async (input) => ({ id: input.userId, email: 'user@example.com', name: 'User', status: (input.status || 'active') as 'active' | 'disabled', roles: [], createdAt: new Date(), updatedAt: new Date() })),
    listRoles: jest.fn(async () => []),
    createRole: jest.fn(async (input) => ({ id: '507f191e810c19729de860eb', key: input.key, name: input.name, description: input.description || '', isSystem: false, permissions: [] })),
    updateRolePermissions: jest.fn(async (roleId) => ({ id: roleId, key: 'editor', name: 'Editor', description: '', isSystem: false, permissions: [] })),
    listPermissions: jest.fn(async () => []),
  };
}

function createCmsService(): CmsService {
  return {
    listContents: jest.fn(async (contentType) => [{
      id: sampleContent.id, contentType: contentType || sampleContent.contentType,
      title: sampleContent.title, slug: sampleContent.slug, status: sampleContent.status,
      version: sampleContent.version, sectionCount: 1, updatedAt: sampleContent.updatedAt,
    }]),
    getContent: jest.fn(async () => sampleContent),
    createContent: jest.fn(async (input) => ({
      ...sampleContent, contentType: input.contentType, title: input.title,
      slug: input.slug || 'generated-slug',
      sections: input.sections.map((section, index) => ({ ...section, id: `507f1f77bcf86cd7994390${index + 30}` })),
    })),
    updateContent: jest.fn(async (input) => ({
      ...sampleContent, contentType: input.contentType, title: input.title,
      slug: input.slug || sampleContent.slug, version: input.expectedVersion + 1,
      sections: input.sections.map((section, index) => ({ ...section, id: `507f1f77bcf86cd7994390${index + 40}` })),
    })),
    deleteContent: jest.fn(async () => undefined),
    publishContent: jest.fn(async (_contentId, expectedVersion) => ({
      ...sampleContent, status: 'published' as const, version: expectedVersion + 1, publishedAt: new Date(),
    })),
    listVersions: jest.fn(async () => [{
      id: '507f1f77bcf86cd799439023', version: 1, contentType: sampleContent.contentType,
      status: 'draft' as const, title: sampleContent.title, slug: sampleContent.slug,
      createdAt: new Date(), actorId: adminPrincipal.userId,
    }]),
  };
}

function buildApp(identityService = createIdentityService(), cmsService = createCmsService()) {
  return createApp({ env, identityService, cmsService });
}
function cookies(response: request.Response): string[] {
  const value = response.headers['set-cookie'];
  return Array.isArray(value) ? value : value ? [value] : [];
}
async function login(app: ReturnType<typeof buildApp>) {
  return request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'StrongPassword1!' });
}

describe('API foundation and identity integration', () => {
  it('reports liveness and dependency readiness', async () => {
    expect((await request(buildApp()).get('/api/v1/health')).status).toBe(200);
    expect((await request(createApp({ env, identityService: createIdentityService(), cmsService: createCmsService(), isReady: () => false })).get('/api/v1/readiness')).status).toBe(503);
  });

  it('logs in, refreshes, and logs out with HttpOnly cookies', async () => {
    const app = buildApp();
    const loginResponse = await login(app);
    expect(loginResponse.status).toBe(200);
    expect(cookies(loginResponse).some((cookie) => cookie.startsWith('ask_access=') && cookie.includes('HttpOnly'))).toBe(true);
    expect((await request(app).post('/api/v1/auth/refresh').set('Cookie', cookies(loginResponse))).status).toBe(200);
    expect((await request(app).post('/api/v1/auth/logout').set('Cookie', cookies(loginResponse))).status).toBe(204);
  });

  it('protects routes and enforces permissions', async () => {
    const app = buildApp(createIdentityService({ ...adminPrincipal, permissions: [] }));
    expect((await request(app).get('/api/v1/admin/users')).status).toBe(401);
    const session = await login(app);
    expect((await request(app).get('/api/v1/admin/users').set('Cookie', cookies(session))).status).toBe(403);
  });

  it('serves user management and password changes', async () => {
    const app = buildApp();
    const session = await login(app);
    expect((await request(app).get('/api/v1/admin/users').set('Cookie', cookies(session))).status).toBe(200);
    expect((await request(app).post('/api/v1/auth/change-password').set('Cookie', cookies(session)).send({ currentPassword: 'StrongPassword1!', newPassword: 'DifferentPassword2!' })).status).toBe(204);
  });

  it('enforces CMS read permissions', async () => {
    const app = buildApp(createIdentityService({ ...adminPrincipal, permissions: [] }));
    const session = await login(app);
    expect((await request(app).get('/api/v1/admin/content').set('Cookie', cookies(session))).status).toBe(403);
  });

  it('filters, creates, updates, publishes, versions, and deletes typed content', async () => {
    const cmsService = createCmsService();
    const app = buildApp(createIdentityService(), cmsService);
    const session = await login(app);
    const cookie = cookies(session);

    expect((await request(app).get('/api/v1/admin/content?type=news').set('Cookie', cookie)).status).toBe(200);
    expect(cmsService.listContents).toHaveBeenCalledWith('news');

    const created = await request(app).post('/api/v1/admin/content').set('Cookie', cookie).send({
      contentType: 'news', title: 'ASK launches a new service',
      sections: [{ type: 'text', position: 0, data: { body: 'Details' } }],
    });
    expect(created.status).toBe(201);
    expect(created.body.data.content.contentType).toBe('news');

    expect((await request(app).put(`/api/v1/admin/content/${sampleContent.id}`).set('Cookie', cookie).send({
      contentType: 'news', title: 'Updated news', sections: [], expectedVersion: 1,
    })).status).toBe(200);
    const published = await request(app).post(`/api/v1/admin/content/${sampleContent.id}/publish`).set('Cookie', cookie).send({ expectedVersion: 1 });
    expect(published.body.data.content.status).toBe('published');
    expect((await request(app).get(`/api/v1/admin/content/${sampleContent.id}/versions`).set('Cookie', cookie)).status).toBe(200);
    expect((await request(app).delete(`/api/v1/admin/content/${sampleContent.id}`).set('Cookie', cookie)).status).toBe(204);
    expect(cmsService.createContent).toHaveBeenCalled();
    expect(cmsService.publishContent).toHaveBeenCalled();
  });

  it('rejects unsupported content types', async () => {
    const app = buildApp();
    const session = await login(app);
    const response = await request(app).post('/api/v1/admin/content').set('Cookie', cookies(session)).send({
      contentType: 'booking', title: 'Not CMS content',
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('uses standard errors for malformed JSON and missing routes', async () => {
    const app = buildApp();
    expect((await request(app).post('/api/v1/auth/login').set('content-type', 'application/json').send('{')).body.error.code).toBe('INVALID_JSON');
    expect((await request(app).get('/missing')).body.error.code).toBe('NOT_FOUND');
  });
});
