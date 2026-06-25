import { AppError } from '../http/errors';
import { BookingType, PriceBreakdown, PricingRequest } from './types';

export const PRICING_RULE_VERSION = '2026.1';
export const PRICING_VALID_FROM = new Date('2026-01-01T00:00:00.000Z');
export const PRICING_VALID_UNTIL = new Date('2026-12-31T23:59:59.999Z');
interface PricingContext { privateBenefitAvailable: boolean; }
interface PricingRule { bookingType: BookingType; minimumHours: number; weekdayHourly?: number; weekendHourly?: number; weekendFlat?: number; firstFourHourly?: number; additionalHourly?: number; kitchenFee: number; saunaFee: number; }
const rules: PricingRule[] = [
  { bookingType:'arcada_association',minimumHours:0,weekendFlat:75,kitchenFee:0,saunaFee:30 },
  { bookingType:'ask_member',minimumHours:4,weekdayHourly:30,weekendHourly:40,kitchenFee:25,saunaFee:20 },
  { bookingType:'alumni',minimumHours:4,weekdayHourly:40,weekendHourly:50,kitchenFee:35,saunaFee:25 },
  { bookingType:'external',minimumHours:4,firstFourHourly:65,additionalHourly:40,kitchenFee:60,saunaFee:40 },
];
const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
const helsinkiWeekday=(date:Date)=>new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Helsinki',weekday:'short'}).format(date);
const weekend=(date:Date)=>['Fri','Sat','Sun'].includes(helsinkiWeekday(date));

export function calculateBookingPrice(input:PricingRequest,context:PricingContext):PriceBreakdown{
  if(input.startAt<PRICING_VALID_FROM||input.startAt>PRICING_VALID_UNTIL)throw new AppError(400,'PRICING_RULE_NOT_FOUND','No pricing rule is valid for the selected date');
  const durationHours=(input.endAt.getTime()-input.startAt.getTime())/3_600_000;
  if(durationHours<=0)throw new AppError(400,'INVALID_DURATION','Booking end must be after start');
  if(input.bookingType==='internal_ask'){
    if(!input.internalAskPurpose)throw new AppError(400,'INTERNAL_PURPOSE_REQUIRED','Internal ASK purpose is required');
    const free=input.internalAskPurpose==='official_activity'||context.privateBenefitAvailable;
    if(free)return{currency:'EUR',rentalPrice:0,kitchenFee:0,saunaFee:0,discount:0,totalPrice:0,minimumHours:0,billableHours:durationHours,benefitApplied:input.internalAskPurpose==='official_activity'?'official_ask_activity':'board_private_booking',pricingRuleVersion:PRICING_RULE_VERSION,manualOverride:false};
    return calculateBookingPrice({...input,bookingType:'ask_member'},{privateBenefitAvailable:false});
  }
  const rule=rules.find(item=>item.bookingType===input.bookingType);
  if(!rule)throw new AppError(400,'PRICING_RULE_NOT_FOUND','No pricing rule exists for this booking type');
  if(durationHours<rule.minimumHours)throw new AppError(400,'MINIMUM_DURATION',`Minimum booking duration is ${rule.minimumHours} hours`);
  let rentalPrice=0;
  if(rule.weekendFlat!==undefined)rentalPrice=weekend(input.startAt)?rule.weekendFlat:0;
  else if(rule.firstFourHourly!==undefined&&rule.additionalHourly!==undefined)rentalPrice=Math.min(durationHours,4)*rule.firstFourHourly+Math.max(durationHours-4,0)*rule.additionalHourly;
  else rentalPrice=durationHours*(weekend(input.startAt)?rule.weekendHourly!:rule.weekdayHourly!);
  const kitchenFee=input.kitchenExtra?rule.kitchenFee:0,saunaFee=input.saunaExtra?rule.saunaFee:0;
  return{currency:'EUR',rentalPrice:money(rentalPrice),kitchenFee,saunaFee,discount:0,totalPrice:money(rentalPrice+kitchenFee+saunaFee),minimumHours:rule.minimumHours,billableHours:durationHours,pricingRuleVersion:PRICING_RULE_VERSION,manualOverride:false};
}
