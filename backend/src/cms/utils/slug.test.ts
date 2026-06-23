import { slugify } from './slug';

describe('slugify', () => {
  it('creates stable URL-safe slugs', () => {
    expect(slugify('  What’s Happening at Cör!  ')).toBe('what-s-happening-at-cor');
  });

  it('removes repeated and surrounding separators', () => {
    expect(slugify('ASK --- Student Services')).toBe('ask-student-services');
  });
});
