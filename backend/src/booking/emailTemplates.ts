import { formatDateRange } from '../formatting/dateTime';
import { resolveBookingLanguage } from '../localization/languages';
import { BookingEmailType, BookingRecord } from './types';

type BookingEmailTemplate = Record<Exclude<BookingEmailType, 'reminder'>, string>;

const subjects: Record<'sv' | 'en' | 'fi', BookingEmailTemplate> = {
  sv: { booking_received: 'Bokning mottagen', quote_requested: 'Offertförfrågan mottagen', quote_sent: 'Offert skickad', booking_approved: 'Bokning godkänd', contract_ready: 'Avtal klart', booking_completed: 'Bokning slutförd' },
  en: { booking_received: 'Booking received', quote_requested: 'Quote requested', quote_sent: 'Quote sent', booking_approved: 'Booking approved', contract_ready: 'Contract ready', booking_completed: 'Booking completed' },
  fi: { booking_received: 'Varaus vastaanotettu', quote_requested: 'Tarjouspyyntö vastaanotettu', quote_sent: 'Tarjous lähetetty', booking_approved: 'Varaus hyväksytty', contract_ready: 'Sopimus valmis', booking_completed: 'Varaus valmis' },
};

export function buildBookingEmail(booking: BookingRecord, type: Exclude<BookingEmailType, 'reminder'>) {
  const language = resolveBookingLanguage(booking.locale);
  const subject = subjects[language][type];
  const period = formatDateRange(booking.startAt, booking.endAt);
  const total = booking.price.totalPrice.toFixed(2);
  const text = language === 'en'
    ? subject + ' for ' + booking.reference + '. Time: ' + period + '. Status: ' + booking.status + '. Total: ' + total + ' EUR.'
    : language === 'fi'
      ? subject + ' varaukselle ' + booking.reference + '. Aika: ' + period + '. Tila: ' + booking.status + '. Yhteensä: ' + total + ' EUR.'
      : subject + ' för ' + booking.reference + '. Tid: ' + period + '. Status: ' + booking.status + '. Total: ' + total + ' EUR.';
  return { subject: subject + ' ' + booking.reference, text };
}
