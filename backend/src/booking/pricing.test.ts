import { defaultBookingPricingRules } from './defaultPricing';
import { calculateBookingPrice } from './pricing';
import { BookingPricingRule } from './types';

const rules = defaultBookingPricingRules.map((rule, index) => ({ ...rule, id: `rule-${index}`, createdAt: new Date(), updatedAt: new Date() })) as BookingPricingRule[];
const context = { privateBenefitAvailable: false, rules };
const base = { resourceSlug: 'main-hall', startAt: new Date('2026-07-01T10:00:00Z'), endAt: new Date('2026-07-01T14:00:00Z'), kitchenExtra: false, saunaExtra: false };

describe('Cor House configurable pricing', () => {
  it('makes weekday Arcada Association bookings free from seeded defaults', () => expect(calculateBookingPrice({ ...base, bookingType: 'arcada_association' }, context).totalPrice).toBe(0));
  it('charges ASK Member hourly pricing and extras from seeded defaults', () => expect(calculateBookingPrice({ ...base, bookingType: 'ask_member', kitchenExtra: true, saunaExtra: true }, context).totalPrice).toBe(165));
  it('applies the external first-four-hour tier from seeded defaults', () => expect(calculateBookingPrice({ ...base, bookingType: 'external', endAt: new Date('2026-07-01T16:00:00Z') }, context).rentalPrice).toBe(340));
  it('applies one free internal private booking benefit', () => expect(calculateBookingPrice({ ...base, bookingType: 'internal_ask', internalAskPurpose: 'private_booking' }, { ...context, privateBenefitAvailable: true }).benefitApplied).toBe('board_private_booking'));
});
