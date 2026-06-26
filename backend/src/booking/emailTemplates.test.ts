import { buildBookingEmail } from './emailTemplates';
import { BookingRecord } from './types';

const booking = { id: '1', reference: 'COR-2026-0001', startAt: new Date('2026-09-02T11:30:00.000Z'), endAt: new Date('2026-09-02T14:30:00.000Z'), requesterEmail: 'student@example.com', locale: 'fi', status: 'approved', price: { totalPrice: 42 } } as BookingRecord;

describe('booking email templates', () => {
  it('uses booking language and shared date/time formatting', () => {
    const email = buildBookingEmail(booking, 'booking_approved');
    expect(email.subject).toContain('Varaus hyväksytty');
    expect(email.text).toContain('02.09.2026 14:30–17:30');
  });

  it('does not include the Cor House door code in normal emails', () => {
    const email = buildBookingEmail(booking, 'contract_ready');
    expect(email.text.toLowerCase()).not.toContain('door code');
    expect(email.text.toLowerCase()).not.toContain('dörrkod');
    expect(email.text.toLowerCase()).not.toContain('ovikoodi');
  });
});
