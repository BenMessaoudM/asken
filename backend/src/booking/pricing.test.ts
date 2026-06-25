import { calculateBookingPrice } from './pricing';
const base={resourceSlug:'main-hall',startAt:new Date('2026-07-01T10:00:00Z'),endAt:new Date('2026-07-01T14:00:00Z'),kitchenExtra:false,saunaExtra:false};
describe('Cor House pricing',()=>{
 it('makes weekday Arcada Association bookings free',()=>expect(calculateBookingPrice({...base,bookingType:'arcada_association'},{privateBenefitAvailable:false}).totalPrice).toBe(0));
 it('charges ASK Member hourly pricing and extras',()=>expect(calculateBookingPrice({...base,bookingType:'ask_member',kitchenExtra:true,saunaExtra:true},{privateBenefitAvailable:false}).totalPrice).toBe(165));
 it('applies the external first-four-hour tier',()=>expect(calculateBookingPrice({...base,bookingType:'external',endAt:new Date('2026-07-01T16:00:00Z')},{privateBenefitAvailable:false}).rentalPrice).toBe(340));
 it('applies one free internal private booking benefit',()=>expect(calculateBookingPrice({...base,bookingType:'internal_ask',internalAskPurpose:'private_booking'},{privateBenefitAvailable:true}).benefitApplied).toBe('board_private_booking'));
});
