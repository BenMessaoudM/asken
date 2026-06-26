import { BookingCategoryInput, BookingPricingRuleInput } from './types';

export const defaultBookingCategories: BookingCategoryInput[] = [
  { key: 'internal_ask', name: { sv: 'Internal ASK', en: 'Internal ASK', fi: 'ASK:n sisäinen' }, description: { sv: 'Officiell ASK-verksamhet och styrelsens privata förmån.', en: 'Official ASK activity and board private benefit.', fi: 'ASK:n virallinen toiminta ja hallituksen yksityisetu.' }, active: true, displayOrder: 10, billingAddressRequired: false, contractRequired: true, quoteRequestAllowed: false, public: true },
  { key: 'arcada_association', name: { sv: 'Arcadaförening', en: 'Arcada Association', fi: 'Arcadan yhdistys' }, description: { sv: 'Registrerade Arcadaföreningar.', en: 'Registered Arcada associations.', fi: 'Rekisteröidyt Arcadan yhdistykset.' }, active: true, displayOrder: 20, billingAddressRequired: true, contractRequired: true, quoteRequestAllowed: true, public: true },
  { key: 'ask_member', name: { sv: 'ASK-medlem', en: 'ASK Member', fi: 'ASK:n jäsen' }, description: { sv: 'Medlemmar i Arcada Studerandekår.', en: 'Members of Arcada Student Union.', fi: 'Arcadan opiskelijakunnan jäsenet.' }, active: true, displayOrder: 30, billingAddressRequired: true, contractRequired: true, quoteRequestAllowed: true, public: true },
  { key: 'alumni', name: { sv: 'Alumn', en: 'Alumni', fi: 'Alumni' }, description: { sv: 'Alumner och tidigare studerande.', en: 'Alumni and former students.', fi: 'Alumnit ja entiset opiskelijat.' }, active: true, displayOrder: 40, billingAddressRequired: true, contractRequired: true, quoteRequestAllowed: true, public: true },
  { key: 'external', name: { sv: 'Extern', en: 'External', fi: 'Ulkoinen' }, description: { sv: 'Externa bokare och organisationer.', en: 'External bookers and organizations.', fi: 'Ulkoiset varaajat ja organisaatiot.' }, active: true, displayOrder: 50, billingAddressRequired: true, contractRequired: true, quoteRequestAllowed: true, public: true },
];

const validFrom = new Date('2026-01-01T00:00:00.000Z');
const validUntil = new Date('2026-12-31T23:59:59.999Z');

export const defaultBookingPricingRules: BookingPricingRuleInput[] = [
  { version: '2026.1-arcada', resourceSlug: 'all', bookingType: 'arcada_association', active: true, validFrom, validUntil, minimumHours: 0, weekdayFixedPrice: 0, weekendFixedPrice: 75, kitchenFee: 0, saunaFee: 30, kitchenIncluded: true, saunaIncluded: false, manualOverrideAllowed: true, displayOrder: 20 },
  { version: '2026.1-ask-member', resourceSlug: 'all', bookingType: 'ask_member', active: true, validFrom, validUntil, minimumHours: 4, weekdayHourly: 30, weekendHourly: 40, kitchenFee: 25, saunaFee: 20, kitchenIncluded: false, saunaIncluded: false, manualOverrideAllowed: true, displayOrder: 30 },
  { version: '2026.1-alumni', resourceSlug: 'all', bookingType: 'alumni', active: true, validFrom, validUntil, minimumHours: 4, weekdayHourly: 40, weekendHourly: 50, kitchenFee: 35, saunaFee: 25, kitchenIncluded: false, saunaIncluded: false, manualOverrideAllowed: true, displayOrder: 40 },
  { version: '2026.1-external', resourceSlug: 'all', bookingType: 'external', active: true, validFrom, validUntil, minimumHours: 4, firstHours: 4, firstHoursHourly: 65, additionalHourly: 40, kitchenFee: 60, saunaFee: 40, kitchenIncluded: false, saunaIncluded: false, manualOverrideAllowed: true, displayOrder: 50 },
];
