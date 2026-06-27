import { defaultBookingCategories, defaultBookingPricingRules } from './defaultPricing';
import { calculateBookingPrice } from './pricing';
import { BookingPricingRule } from './types';

const rules = defaultBookingPricingRules.map((rule, index) => ({ ...rule, id: `rule-${index}`, createdAt: new Date(), updatedAt: new Date() })) as BookingPricingRule[];
const context = { privateBenefitAvailable: false, rules };

describe('Booking hardening defaults', () => {
  it('does not require rental contracts for Arcada Association by default', () => {
    const category = defaultBookingCategories.find((item) => item.key === 'arcada_association');
    expect(category?.contractRequired).toBe(false);
    expect(category?.billingAddressRequired).toBe(false);
    expect(category?.quoteRequestAllowed).toBe(true);
  });

  it('keeps paid Arcada Association weekend sauna pricing configurable in defaults', () => {
    const price = calculateBookingPrice({
      bookingType: 'arcada_association',
      resourceSlug: 'meeting-room-sauna',
      startAt: new Date('2026-07-18T13:00:00.000Z'),
      endAt: new Date('2026-07-18T17:00:00.000Z'),
      kitchenExtra: true,
      saunaExtra: true,
    }, context);
    expect(price.rentalPrice).toBe(75);
    expect(price.kitchenFee).toBe(0);
    expect(price.saunaFee).toBe(30);
    expect(price.totalPrice).toBe(105);
  });
});
