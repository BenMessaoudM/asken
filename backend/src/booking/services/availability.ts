import { AppError } from '../../http/errors';
import { BookingResource } from '../types';

export const SLOT_MINUTES = 15;
export function bookingSlots(startAt: Date, endAt: Date): Date[] {
  const step = SLOT_MINUTES * 60_000;
  const start = Math.floor(startAt.getTime() / step) * step;
  const end = Math.ceil(endAt.getTime() / step) * step;
  const slots: Date[] = [];
  for (let value = start; value < end; value += step) slots.push(new Date(value));
  return slots;
}

function helsinkiParts(value: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Helsinki', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { weekday: weekdays[get('weekday')], time: `${get('hour')}:${get('minute')}` };
}

export function assertBookable(resource: BookingResource, startAt: Date, endAt: Date, attendees: number, now = new Date()) {
  if (!resource.active) throw new AppError(400, 'RESOURCE_UNAVAILABLE', 'Resource is not available for booking');
  if (startAt <= now) throw new AppError(400, 'BOOKING_IN_PAST', 'Booking must start in the future');
  const duration = (endAt.getTime() - startAt.getTime()) / 60_000;
  if (duration < resource.minDurationMinutes || duration > resource.maxDurationMinutes) throw new AppError(400, 'INVALID_DURATION', 'Booking duration is outside the resource limits');
  if (endAt.getTime() > now.getTime() + resource.advanceBookingDays * 86_400_000) throw new AppError(400, 'BOOKING_TOO_FAR_AHEAD', 'Booking is outside the advance booking window');
  if (attendees > resource.capacity) throw new AppError(400, 'CAPACITY_EXCEEDED', 'Attendee count exceeds resource capacity');
  const startLocal = helsinkiParts(startAt); const endLocal = helsinkiParts(endAt);
  const opening = resource.openingHours.some((hours) => hours.weekday === startLocal.weekday && hours.weekday === endLocal.weekday && startLocal.time >= hours.start && endLocal.time <= hours.end);
  if (!opening) throw new AppError(400, 'OUTSIDE_OPENING_HOURS', 'Booking is outside resource opening hours');
  if (resource.blackoutPeriods.some((period) => startAt < period.endAt && endAt > period.startAt)) throw new AppError(409, 'RESOURCE_BLACKOUT', 'Resource is unavailable during the selected time');
}
