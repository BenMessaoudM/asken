import { MongooseGovernanceService } from './mongooseGovernanceService';

describe('governance service public mapping', () => {
  it('uses Swedish fallback before English for public documents', () => {
    const service = new MongooseGovernanceService() as unknown as { publicDocument: (doc: Record<string, unknown>, locale: 'en') => { title: string; description: string } };
    const document = service.publicDocument({ _id: { toString: () => 'doc-1' }, title: { sv: 'Protokoll', en: '' }, slug: 'protokoll', description: { sv: 'Svensk text', en: '' }, documentType: 'minutes', governanceBody: 'fullmaktige', year: 2026, language: 'sv', fileUrl: 'https://example.com/protokoll.pdf', isPublic: true, isPublished: true, displayOrder: 1, tags: { sv: '', en: '' } }, 'en');
    expect(document.title).toBe('Protokoll');
    expect(document.description).toBe('Svensk text');
  });
});
