import { recruitmentInputSchema, personInputSchema } from './organizationSchemas';

describe('organization validation', () => {
  it('accepts Swedish-first person data', () => {
    const input = personInputSchema.parse({
      fullName: 'Test Person',
      positionTitle: { sv: 'Ordförande', en: 'Chair' },
      email: 'person@example.com',
      type: 'board',
    });
    expect(input.positionTitle.sv).toBe('Ordförande');
    expect(input.type).toBe('board');
  });

  it('rejects recruitment campaigns with invalid date order', () => {
    const result = recruitmentInputSchema.safeParse({
      title: { sv: 'Tutorrekrytering', en: 'Tutor Recruitment' },
      description: { sv: '', en: '' },
      type: 'tutor',
      openingDate: '2030-02-01T10:00:00.000Z',
      closingDate: '2030-01-01T10:00:00.000Z',
      ctaLabel: { sv: 'Ansök', en: 'Apply' },
      ctaUrl: 'https://example.com/apply',
    });
    expect(result.success).toBe(false);
  });
});
