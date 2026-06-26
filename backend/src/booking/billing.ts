import { AppError } from '../http/errors';
import { BillingAddress, PriceBreakdown } from './types';

export const requiresBillingAddress = (price: Pick<PriceBreakdown, 'totalPrice'>) => price.totalPrice > 0;

export const hasCompleteBillingAddress = (address?: BillingAddress) => Boolean(
  address?.name?.trim() &&
  address.address?.trim() &&
  address.postalCode?.trim() &&
  address.city?.trim() &&
  address.country?.trim()
);

export function assertBillingAddressForPaidBooking(price: Pick<PriceBreakdown, 'totalPrice'>, address?: BillingAddress, required = true) {
  if (required && requiresBillingAddress(price) && !hasCompleteBillingAddress(address)) {
    throw new AppError(400, 'BILLING_ADDRESS_REQUIRED', 'Complete billing address is required for paid bookings');
  }
}
