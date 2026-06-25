import { bookingRequestSchema, bookingResourceSchema } from './bookingSchemas';

describe('booking validation', () => {
  it('accepts a bilingual resource policy', () => {
    expect(bookingResourceSchema.safeParse({ name:{en:'Room',sv:'Rum'},description:{en:'A room',sv:'Ett rum'},location:{en:'Cor',sv:'Cor'},rules:{en:'Be kind',sv:'Var snäll'},capacity:20,accessibility:{en:'Step-free',sv:'Stegfri'},active:true,requiresApproval:true,minDurationMinutes:30,maxDurationMinutes:240,advanceBookingDays:90,openingHours:[{weekday:1,start:'08:00',end:'20:00'}],blackoutPeriods:[] }).success).toBe(true);
  });
  it('rejects invalid booking ranges and missing privacy acceptance', () => {
    const result = bookingRequestSchema.safeParse({ resourceId:'507f1f77bcf86cd799439011',startAt:'2030-01-01T12:00:00.000Z',endAt:'2030-01-01T10:00:00.000Z',requesterName:'Student',requesterEmail:'student@example.com',purpose:'Meeting',attendees:2,locale:'en',privacyAccepted:false });
    expect(result.success).toBe(false);
  });
});
