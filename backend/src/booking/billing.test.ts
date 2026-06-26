import { assertBillingAddressForPaidBooking, hasCompleteBillingAddress, requiresBillingAddress } from './billing';
import { BillingAddress, PriceBreakdown } from './types';

const price = (totalPrice: number) => ({ totalPrice } as Pick<PriceBreakdown, 'totalPrice'>);
const billing: BillingAddress = {
  name: 'Arcada Student',
  address: 'Jan-Magnus Janssons plats 1',
  postalCode: '00560',
  city: 'Helsinki',
  country: 'Finland'
};

describe('booking billing requirements', () => {
  it('requires billing address only for paid bookings', () => {
    expect(requiresBillingAddress(price(100))).toBe(true);
    expect(requiresBillingAddress(price(0))).toBe(false);
  });

  it('accepts paid bookings with complete billing address', () => {
    expect(hasCompleteBillingAddress(billing)).toBe(true);
    expect(() => assertBillingAddressForPaidBooking(price(100), billing)).not.toThrow();
  });

  it('blocks paid booking contract generation without complete billing address', () => {
    expect(hasCompleteBillingAddress({ ...billing, postalCode: '' })).toBe(false);
    expect(() => assertBillingAddressForPaidBooking(price(100), { ...billing, postalCode: '' })).toThrow('Complete billing address is required');
  });

  it('does not block free bookings without billing address', () => {
    expect(() => assertBillingAddressForPaidBooking(price(0), undefined)).not.toThrow();
  });
});
