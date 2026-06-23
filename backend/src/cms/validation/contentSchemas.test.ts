import { contentSectionsSchema, contentTypeSchema } from './contentSchemas';

it('accepts every CMS content type', () => {
  for (const type of ['page', 'news', 'event', 'cor_activity', 'governance_document', 'collaboration']) {
    expect(contentTypeSchema.parse(type)).toBe(type);
  }
});

it('accepts all supported section types', () => {
  expect(contentSectionsSchema.parse([
    { type: 'hero', position: 0, data: { heading: 'Welcome' } },
    { type: 'text', position: 1, data: { body: 'Body' } },
    { type: 'image', position: 2, data: { url: 'https://example.com/image.jpg', alt: 'Example' } },
    { type: 'cta', position: 3, data: { heading: 'Join', label: 'Apply', url: 'https://example.com' } },
    { type: 'faq', position: 4, data: { items: [{ question: 'Why?', answer: 'Because.' }] } },
  ])).toHaveLength(5);
});

it('rejects non-contiguous section positions', () => {
  expect(() => contentSectionsSchema.parse([
    { type: 'text', position: 0, data: { body: 'One' } },
    { type: 'text', position: 2, data: { body: 'Two' } },
  ])).toThrow();
});
