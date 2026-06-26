import { localizedValue } from '../../localization/languages';
import { calculateRecruitmentStatus } from './mongooseOrganizationService';

describe('organization service helpers', () => {
  it('calculates recruitment campaign status from dates', () => {
    const open = new Date('2030-01-10T12:00:00.000Z');
    expect(calculateRecruitmentStatus(new Date('2030-01-11T00:00:00.000Z'), new Date('2030-01-20T00:00:00.000Z'), open)).toBe('coming_soon');
    expect(calculateRecruitmentStatus(new Date('2030-01-01T00:00:00.000Z'), new Date('2030-01-20T00:00:00.000Z'), open)).toBe('open');
    expect(calculateRecruitmentStatus(new Date('2030-01-01T00:00:00.000Z'), new Date('2030-01-09T00:00:00.000Z'), open)).toBe('closed');
  });

  it('uses Swedish before English fallback for organization content', () => {
    expect(localizedValue({ sv: 'Alumner', en: 'Alumni' }, 'en')).toBe('Alumni');
    expect(localizedValue({ sv: 'Alumner', en: '' }, 'en')).toBe('Alumner');
  });
});
