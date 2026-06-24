import request from 'supertest';
import { createApp } from './app';
import { CmsService, ManagedContent } from './cms/types';
import { Env } from './env';
import { issueTokens } from './identity/security/tokens';
import { AuthPrincipal, IdentityService } from './identity/types';
import { ManagedNewsArticle, NewsService, NewsTaxonomyItem, PublicNewsArticle } from './news/types';
import { EventCategory, EventService, ManagedEvent, PublicEvent } from './events/types';

const env = {
  NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://localhost:27017/asken-test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin',
} satisfies Env;

const adminPrincipal: AuthPrincipal = {
  userId: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin',
  roles: ['super_admin'], permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'content.read', 'content.write', 'news.read', 'news.write', 'events.read', 'events.write'],
};

const sampleContent: ManagedContent = {
  id: '507f1f77bcf86cd799439021', contentType: 'page', title: 'About ASK', slug: 'about-ask',
  status: 'draft', version: 1,
  sections: [{ id: '507f1f77bcf86cd799439022', type: 'text', position: 0, data: { body: 'About us' } }],
  createdAt: new Date(), updatedAt: new Date(),
};


const category: NewsTaxonomyItem = {
  id: '507f1f77bcf86cd799439031', slug: 'campus', labels: { en: 'Campus', sv: 'Campus' },
  createdAt: new Date(), updatedAt: new Date(),
};
const sampleArticle: ManagedNewsArticle = {
  id: '507f1f77bcf86cd799439032', contentId: '507f1f77bcf86cd799439033', slug: 'welcome-week',
  status: 'draft', version: 1,
  translations: {
    en: { title: 'Welcome week', summary: 'Join us', body: 'English article' },
    sv: { title: 'Välkomstvecka', summary: 'Kom med', body: 'Svensk artikel' },
  },
  categories: [category], tags: [], featured: true, createdAt: new Date(), updatedAt: new Date(),
};
const publicArticle: PublicNewsArticle = {
  id: sampleArticle.id, slug: sampleArticle.slug, title: 'Välkomstvecka', summary: 'Kom med', body: 'Svensk artikel',
  locale: 'sv', categories: [{ slug: 'campus', label: 'Campus' }], tags: [], featured: true, publishedAt: new Date(),
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

function createNewsService(): NewsService {
  return {
    listAdminArticles: jest.fn(async () => [sampleArticle]),
    getAdminArticle: jest.fn(async () => sampleArticle),
    createArticle: jest.fn(async (input) => ({ ...sampleArticle, translations: input.translations, featured: input.featured })),
    updateArticle: jest.fn(async (_id, input) => ({ ...sampleArticle, translations: input.translations, version: input.expectedVersion + 1 })),
    deleteArticle: jest.fn(async () => undefined),
    publishArticle: jest.fn(async (_id, expectedVersion, publishAt) => ({ ...sampleArticle, status: publishAt ? 'scheduled' as const : 'published' as const, version: expectedVersion + 1, publishedAt: publishAt || new Date(), scheduledAt: publishAt })),
    setFeatured: jest.fn(async (_id, featured) => ({ ...sampleArticle, featured })),
    listPublicArticles: jest.fn(async (query) => ({ articles: [{ ...publicArticle, locale: query.locale }], total: 1, page: query.page, limit: query.limit })),
    getPublicArticle: jest.fn(async (_slug, locale) => ({ ...publicArticle, locale })),
    listCategories: jest.fn(async () => [category]),
    createCategory: jest.fn(async (input) => ({ ...category, labels: input.labels })),
    updateCategory: jest.fn(async (_id, input) => ({ ...category, labels: input.labels })),
    deleteCategory: jest.fn(async () => undefined),
    listTags: jest.fn(async () => []),
    createTag: jest.fn(async (input) => ({ ...category, id: '507f1f77bcf86cd799439034', labels: input.labels })),
    updateTag: jest.fn(async (_id, input) => ({ ...category, id: '507f1f77bcf86cd799439034', labels: input.labels })),
    deleteTag: jest.fn(async () => undefined),
  };
}

const eventCategory: EventCategory = { id: '507f1f77bcf86cd799439041', slug: 'student-life', labels: { en: 'Student life', sv: 'Studieliv' }, createdAt: new Date(), updatedAt: new Date() };
const sampleEvent: ManagedEvent = { id: '507f1f77bcf86cd799439042', contentId: '507f1f77bcf86cd799439043', slug: 'welcome-event', publicationStatus: 'draft', temporalStatus: 'upcoming', version: 1, translations: { en: { title: 'Welcome event', description: 'Join us', organizer: 'ASK', location: 'Cor' }, sv: { title: 'Välkomstevenemang', description: 'Kom med', organizer: 'ASK', location: 'Cor' } }, startAt: new Date('2030-01-01T10:00:00Z'), endAt: new Date('2030-01-01T12:00:00Z'), category: eventCategory, eventStatus: 'scheduled', featured: true, createdAt: new Date(), updatedAt: new Date() };
const publicEvent: PublicEvent = { id: sampleEvent.id, slug: sampleEvent.slug, ...sampleEvent.translations.sv, startAt: sampleEvent.startAt, endAt: sampleEvent.endAt, eventStatus: 'scheduled', temporalStatus: 'upcoming', category: { slug: eventCategory.slug, label: eventCategory.labels.sv }, featured: true, locale: 'sv' };
function createEventService(): EventService { return { listAdminEvents: jest.fn(async()=>[sampleEvent]), getAdminEvent: jest.fn(async()=>sampleEvent), createEvent: jest.fn(async()=>sampleEvent), updateEvent: jest.fn(async(_id,input)=>({...sampleEvent,version:input.expectedVersion+1})), deleteEvent: jest.fn(async()=>undefined), publishEvent: jest.fn(async(_id,v)=>({...sampleEvent,publicationStatus:'published' as const,version:v+1})), setFeatured: jest.fn(async(_id,featured)=>({...sampleEvent,featured})), listPublicEvents: jest.fn(async q=>({events:[{...publicEvent,locale:q.locale}],total:1,page:q.page,limit:q.limit})), getPublicEvent: jest.fn(async(_slug,locale)=>({...publicEvent,locale})), calendar: jest.fn(async q=>[{...publicEvent,locale:q.locale}]), listCategories: jest.fn(async()=>[eventCategory]), createCategory: jest.fn(async input=>({...eventCategory,labels:input.labels})), updateCategory: jest.fn(async(_id,input)=>({...eventCategory,labels:input.labels})), deleteCategory: jest.fn(async()=>undefined) }; }

function buildApp(identityService = createIdentityService(), cmsService = createCmsService(), newsService = createNewsService(), eventService = createEventService()) {
  return createApp({ env, identityService, cmsService, newsService, eventService });
}
function cookies(response: request.Response): string[] {
  const value = response.headers['set-cookie'];
  return Array.isArray(value) ? value : value ? [value] : [];
}
async function login(app: ReturnType<typeof buildApp>) {
  return request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'StrongPassword1!' });
}

describe('API foundation and identity integration', () => {
  it.each([
    'http://127.0.0.1:5174',
    'http://localhost:5174',
  ])('accepts admin login preflight from %s', async (origin) => {
    const response = await request(buildApp())
      .options('/api/v1/auth/login')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(origin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
  });

  it('reports liveness and dependency readiness', async () => {
    expect((await request(buildApp()).get('/api/v1/health')).status).toBe(200);
    expect((await request(createApp({ env, identityService: createIdentityService(), cmsService: createCmsService(), newsService: createNewsService(), eventService: createEventService(), isReady: () => false })).get('/api/v1/readiness')).status).toBe(503);
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
      contentType: 'page', title: 'ASK launches a new service',
      sections: [{ type: 'text', position: 0, data: { body: 'Details' } }],
    });
    expect(created.status).toBe(201);
    expect(created.body.data.content.contentType).toBe('page');

    expect((await request(app).put(`/api/v1/admin/content/${sampleContent.id}`).set('Cookie', cookie).send({
      contentType: 'page', title: 'Updated page', sections: [], expectedVersion: 1,
    })).status).toBe(200);
    const published = await request(app).post(`/api/v1/admin/content/${sampleContent.id}/publish`).set('Cookie', cookie).send({ expectedVersion: 1 });
    expect(published.body.data.content.status).toBe('published');
    expect((await request(app).get(`/api/v1/admin/content/${sampleContent.id}/versions`).set('Cookie', cookie)).status).toBe(200);
    expect((await request(app).delete(`/api/v1/admin/content/${sampleContent.id}`).set('Cookie', cookie)).status).toBe(204);
    expect(cmsService.createContent).toHaveBeenCalled();
    expect(cmsService.publishContent).toHaveBeenCalled();
  });

  it('enforces News permissions while keeping public News readable', async () => {
    const deniedApp = buildApp(createIdentityService({ ...adminPrincipal, permissions: [] }));
    const deniedSession = await login(deniedApp);
    expect((await request(deniedApp).get('/api/v1/admin/news').set('Cookie', cookies(deniedSession))).status).toBe(403);
    expect((await request(deniedApp).get('/api/v1/news?locale=sv&q=vecka')).status).toBe(200);
  });

  it('manages bilingual News articles, scheduling, featured state, and taxonomy', async () => {
    const newsService = createNewsService();
    const app = buildApp(createIdentityService(), createCmsService(), newsService);
    const session = await login(app);
    const cookie = cookies(session);
    const payload = {
      translations: sampleArticle.translations, categoryIds: [category.id], tagIds: [], featured: true,
    };
    expect((await request(app).post('/api/v1/admin/news').set('Cookie', cookie).send(payload)).status).toBe(201);
    expect((await request(app).put(`/api/v1/admin/news/${sampleArticle.id}`).set('Cookie', cookie).send({ ...payload, expectedVersion: 1 })).status).toBe(200);
    expect((await request(app).patch(`/api/v1/admin/news/${sampleArticle.id}/featured`).set('Cookie', cookie).send({ featured: false })).body.data.article.featured).toBe(false);
    const scheduled = await request(app).post(`/api/v1/admin/news/${sampleArticle.id}/publish`).set('Cookie', cookie).send({ expectedVersion: 1, publishAt: '2030-01-01T10:00:00.000Z' });
    expect(scheduled.body.data.article.status).toBe('scheduled');
    expect((await request(app).post('/api/v1/admin/news/categories').set('Cookie', cookie).send({ labels: { en: 'Campus', sv: 'Campus' } })).status).toBe(201);
    expect((await request(app).delete(`/api/v1/admin/news/${sampleArticle.id}`).set('Cookie', cookie)).status).toBe(204);
    expect(newsService.publishArticle).toHaveBeenCalled();
  });

  it('serves public News listing, search, and localized detail', async () => {
    const newsService = createNewsService();
    const app = buildApp(createIdentityService(), createCmsService(), newsService);
    const listing = await request(app).get('/api/v1/news?locale=en&category=campus');
    expect(listing.status).toBe(200);
    expect(listing.body.data.articles[0].locale).toBe('en');
    expect((await request(app).get('/api/v1/news/search?locale=sv&q=vecka')).status).toBe(200);
    const detail = await request(app).get('/api/v1/news/welcome-week?locale=sv');
    expect(detail.body.data.article.title).toBe('Välkomstvecka');
  });

  it('protects Event administration and serves public event search and calendar', async () => { const denied=buildApp(createIdentityService({...adminPrincipal,permissions:[]}));const session=await login(denied);expect((await request(denied).get('/api/v1/admin/events').set('Cookie',cookies(session))).status).toBe(403);const app=buildApp();expect((await request(app).get('/api/v1/events?locale=en&period=upcoming&q=welcome')).status).toBe(200);expect((await request(app).get('/api/v1/events/calendar?locale=sv&from=2029-01-01T00:00:00.000Z&to=2031-01-01T00:00:00.000Z')).status).toBe(200);expect((await request(app).get('/api/v1/events/welcome-event?locale=sv')).body.data.event.title).toBe('Välkomstevenemang'); });
  it('manages event categories and event lifecycle', async () => { const service=createEventService(),app=buildApp(createIdentityService(),createCmsService(),createNewsService(),service),session=await login(app),cookie=cookies(session);const payload={translations:sampleEvent.translations,startAt:'2030-01-01T10:00:00.000Z',endAt:'2030-01-01T12:00:00.000Z',categoryId:eventCategory.id,eventStatus:'scheduled',featured:true};expect((await request(app).post('/api/v1/admin/events').set('Cookie',cookie).send(payload)).status).toBe(201);expect((await request(app).put(`/api/v1/admin/events/${sampleEvent.id}`).set('Cookie',cookie).send({...payload,expectedVersion:1})).status).toBe(200);expect((await request(app).post(`/api/v1/admin/events/${sampleEvent.id}/publish`).set('Cookie',cookie).send({expectedVersion:1})).body.data.event.publicationStatus).toBe('published');expect((await request(app).patch(`/api/v1/admin/events/${sampleEvent.id}/featured`).set('Cookie',cookie).send({featured:false})).body.data.event.featured).toBe(false);expect((await request(app).post('/api/v1/admin/events/categories').set('Cookie',cookie).send({labels:{en:'Culture',sv:'Kultur'}})).status).toBe(201);expect((await request(app).delete(`/api/v1/admin/events/${sampleEvent.id}`).set('Cookie',cookie)).status).toBe(204); });

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
