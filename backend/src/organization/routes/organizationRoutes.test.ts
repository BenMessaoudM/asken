import request from 'supertest';
import { createApp } from '../../app';
import { Env } from '../../env';
import { issueTokens } from '../../identity/security/tokens';
import { AuthPrincipal, IdentityService } from '../../identity/types';
import { OrganizationService } from '../types';

const env = {
  NODE_ENV: 'test', PORT: 3000, MONGO_URI: 'mongodb://localhost:27017/asken-test',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters', JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  ACCESS_TOKEN_TTL_SECONDS: 900, REFRESH_TOKEN_TTL_DAYS: 7, BCRYPT_ROUNDS: 10, COOKIE_SECURE: false,
  FRONTEND_URL: 'http://localhost:5173', ADMIN_URL: 'http://localhost:5174',
  SMTP_HOST: 'localhost', SMTP_AUTH: false, SMTP_SECURE: false, SMTP_PORT: 1025, SMTP_USER: 'test@example.com', SMTP_PASS: 'password', SUPER_ADMIN_NAME: 'Super Admin',
} satisfies Env;
const principal: AuthPrincipal = { userId: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin', roles: ['super_admin'], permissions: ['organization.read', 'organization.write'] };
const identityService: IdentityService = {
  login: jest.fn(async () => ({ principal, ...issueTokens(principal.userId, '507f191e810c19729de860ea', env) })),
  refresh: jest.fn(), logout: jest.fn(), changePassword: jest.fn(), getPrincipal: jest.fn(async () => principal),
  listUsers: jest.fn(), createUser: jest.fn(), updateUser: jest.fn(), listRoles: jest.fn(), createRole: jest.fn(), updateRolePermissions: jest.fn(), listPermissions: jest.fn(),
} as unknown as IdentityService;
const organizationService: OrganizationService = {
  overview: jest.fn(async () => ({ sections: [{ key: 'alumni', label: 'Alumner / Alumni', href: '/alumner', description: 'ASK Alumni' }], featuredCampaigns: [] })),
  listPublicPeople: jest.fn(async () => []), listPublicCommittees: jest.fn(async () => []),
  getPublicStudentCouncil: jest.fn(async () => ({ title: 'Fullmäktige', description: 'Public info', contactEmail: 'info@asken.fi', members: [], documentLinks: [], visible: true, updatedAt: new Date() })),
  listPublicRecruitmentCampaigns: jest.fn(async () => [{ id: '1', title: 'Tutorrekrytering', description: 'Ansök', type: 'tutor', openingDate: new Date(), closingDate: new Date(), ctaLabel: 'Ansök', ctaUrl: 'https://example.com', featured: true, status: 'open' }]),
  getPublicAlumni: jest.fn(async () => ({ title: 'Alumner', intro: 'Intro', body: 'Body', heroImageAltText: '', benefits: [], ctaPrimaryLabel: 'Boka Cor-huset som alumn', ctaPrimaryUrl: '/booking?category=alumni', published: true, updatedAt: new Date() })),
  listPeople: jest.fn(async () => []), createPerson: jest.fn(), updatePerson: jest.fn(), deactivatePerson: jest.fn(),
  listRoleBadges: jest.fn(async () => []), createRoleBadge: jest.fn(), updateRoleBadge: jest.fn(), deactivateRoleBadge: jest.fn(),
  listCommittees: jest.fn(async () => []), createCommittee: jest.fn(), updateCommittee: jest.fn(), deactivateCommittee: jest.fn(),
  getStudentCouncil: jest.fn(), updateStudentCouncil: jest.fn(), listRecruitmentCampaigns: jest.fn(async () => []),
  createRecruitmentCampaign: jest.fn(), updateRecruitmentCampaign: jest.fn(), deactivateRecruitmentCampaign: jest.fn(),
  getAlumni: jest.fn(), updateAlumni: jest.fn(),
} as unknown as OrganizationService;
const app = createApp({ env, identityService, cmsService: {} as never, newsService: {} as never, eventService: {} as never, organizationService });

describe('organization routes', () => {
  it('serves public organization overview and alumni content', async () => {
    expect((await request(app).get('/api/v1/organization?locale=sv')).body.data.sections[0].label).toBe('Alumner / Alumni');
    expect((await request(app).get('/api/v1/organization/alumni?locale=en')).body.data.alumni.ctaPrimaryUrl).toBe('/booking?category=alumni');
  });

  it('protects admin organization endpoints', async () => {
    expect((await request(app).get('/api/v1/admin/organization/people')).status).toBe(401);
    const login = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'Password1!' });
    expect((await request(app).get('/api/v1/admin/organization/people').set('Cookie', login.headers['set-cookie'])).status).toBe(200);
  });
});
