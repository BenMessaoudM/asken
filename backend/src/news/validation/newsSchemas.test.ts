import { articleInputSchema, publicNewsQuerySchema, publishArticleSchema } from './newsSchemas';

const validArticle = {
  translations: {
    en: { title: 'English title', summary: 'English summary', body: 'English body' },
    sv: { title: 'Svensk rubrik', summary: 'Svensk sammanfattning', body: 'Svensk text' },
  },
  categoryIds: [],
  tagIds: [],
  featured: false,
};

describe('news validation', () => {
  it('accepts bilingual article content', () => {
    expect(articleInputSchema.parse(validArticle).translations.sv.title).toBe('Svensk rubrik');
  });

  it('requires image alternative text', () => {
    const result = articleInputSchema.safeParse({
      ...validArticle,
      translations: { ...validArticle.translations, en: { ...validArticle.translations.en, imageUrl: 'https://example.com/image.jpg' } },
    });
    expect(result.success).toBe(false);
  });

  it('parses public filters and scheduled publishing', () => {
    expect(publicNewsQuerySchema.parse({ locale: 'en', featured: 'true', page: '2' })).toMatchObject({ locale: 'en', featured: true, page: 2 });
    expect(publishArticleSchema.parse({ expectedVersion: 1, publishAt: '2030-01-01T10:00:00.000Z' }).publishAt).toContain('2030');
  });
});
