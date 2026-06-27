import { calculateRepresentativeCallStatus, MongooseRepresentativesService } from './mongooseRepresentativesService';

describe('representatives service helpers', () => {
  it('calculates call status from opening and closing dates', () => {
    const opening = new Date('2026-08-01T00:00:00Z');
    const closing = new Date('2026-08-15T23:59:59Z');
    expect(calculateRepresentativeCallStatus(opening, closing, new Date('2026-07-31T12:00:00Z'))).toBe('coming_soon');
    expect(calculateRepresentativeCallStatus(opening, closing, new Date('2026-08-05T12:00:00Z'))).toBe('open');
    expect(calculateRepresentativeCallStatus(opening, closing, new Date('2026-08-16T12:00:00Z'))).toBe('closed');
  });

  it('uses Swedish before English when the selected public value is missing', () => {
    const service = new MongooseRepresentativesService() as unknown as { publicBody: (doc: Record<string, unknown>, locale: 'en') => { name: string; description: string } };
    const body = service.publicBody({ _id: { toString: () => 'body-1' }, name: { sv: 'Kvalitetsråd', en: '' }, slug: 'kvalitetsrad', description: { sv: 'Svensk beskrivning', en: '' }, category: 'arcada_body', appointingBody: 'fullmaktige', defaultTermLengthMonths: 24, eligibilityDescription: { sv: '', en: '' }, applicationInstructions: { sv: '', en: '' } }, 'en');
    expect(body.name).toBe('Kvalitetsråd');
    expect(body.description).toBe('Svensk beskrivning');
  });

  it('does not expose representative email publicly unless contactPublic is true', () => {
    const service = new MongooseRepresentativesService() as unknown as { publicRepresentative: (doc: Record<string, unknown>, locale: 'sv') => { email?: string } };
    const base = { _id: { toString: () => 'rep-1' }, bodyId: { toString: () => 'body-1' }, fullName: 'Student', email: 'student@example.com', role: 'representative', termStart: new Date(), termEnd: new Date(), status: 'active', appointedBy: 'fullmaktige', publicProfile: true, description: { sv: '', en: '' }, displayOrder: 1 };
    expect(service.publicRepresentative({ ...base, contactPublic: false }, 'sv').email).toBeUndefined();
    expect(service.publicRepresentative({ ...base, contactPublic: true }, 'sv').email).toBe('student@example.com');
  });
});
