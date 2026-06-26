import { AppError } from '../http/errors';
import { BookingPricingRule, PriceBreakdown, PricingRequest } from './types';

interface PricingContext { privateBenefitAvailable: boolean; rules: BookingPricingRule[]; }
const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
const helsinkiWeekday=(date:Date)=>new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Helsinki',weekday:'short'}).format(date);
const weekend=(date:Date)=>['Fri','Sat','Sun'].includes(helsinkiWeekday(date));
const valid=(rule:BookingPricingRule,date:Date)=>rule.active&&rule.validFrom<=date&&(!rule.validUntil||rule.validUntil>=date);

function findRule(input:PricingRequest,rules:BookingPricingRule[]){
  const candidates=rules.filter(rule=>rule.bookingType===input.bookingType&&valid(rule,input.startAt)&&(rule.resourceSlug==='all'||rule.resourceSlug===input.resourceSlug));
  candidates.sort((a,b)=>(a.resourceSlug===input.resourceSlug?0:1)-(b.resourceSlug===input.resourceSlug?0:1)||b.validFrom.getTime()-a.validFrom.getTime()||a.displayOrder-b.displayOrder);
  return candidates[0];
}

function priceFromRule(input:PricingRequest,rule:BookingPricingRule,durationHours:number):PriceBreakdown{
  if(durationHours<rule.minimumHours)throw new AppError(400,'MINIMUM_DURATION',`Minimum booking duration is ${rule.minimumHours} hours`);
  let rentalPrice=0;
  if(rule.fixedBookingPrice!==undefined)rentalPrice=rule.fixedBookingPrice;
  else if(rule.weekdayFixedPrice!==undefined||rule.weekendFixedPrice!==undefined)rentalPrice=weekend(input.startAt)?rule.weekendFixedPrice??rule.weekdayFixedPrice??0:rule.weekdayFixedPrice??rule.weekendFixedPrice??0;
  else if(rule.firstHours!==undefined&&rule.firstHoursHourly!==undefined&&rule.additionalHourly!==undefined)rentalPrice=Math.min(durationHours,rule.firstHours)*rule.firstHoursHourly+Math.max(durationHours-rule.firstHours,0)*rule.additionalHourly;
  else if(rule.weekdayHourly!==undefined||rule.weekendHourly!==undefined)rentalPrice=durationHours*(weekend(input.startAt)?rule.weekendHourly??rule.weekdayHourly??0:rule.weekdayHourly??rule.weekendHourly??0);
  const kitchenFee=input.kitchenExtra&&!rule.kitchenIncluded?rule.kitchenFee:0,saunaFee=input.saunaExtra&&!rule.saunaIncluded?rule.saunaFee:0;
  return{currency:'EUR',rentalPrice:money(rentalPrice),kitchenFee:money(kitchenFee),saunaFee:money(saunaFee),discount:0,totalPrice:money(rentalPrice+kitchenFee+saunaFee),minimumHours:rule.minimumHours,billableHours:durationHours,pricingRuleVersion:rule.version,manualOverride:false};
}

export function calculateBookingPrice(input:PricingRequest,context:PricingContext):PriceBreakdown{
  const durationHours=(input.endAt.getTime()-input.startAt.getTime())/3_600_000;
  if(durationHours<=0)throw new AppError(400,'INVALID_DURATION','Booking end must be after start');
  if(input.bookingType==='internal_ask'){
    if(!input.internalAskPurpose)throw new AppError(400,'INTERNAL_PURPOSE_REQUIRED','Internal ASK purpose is required');
    const free=input.internalAskPurpose==='official_activity'||context.privateBenefitAvailable;
    if(free)return{currency:'EUR',rentalPrice:0,kitchenFee:0,saunaFee:0,discount:0,totalPrice:0,minimumHours:0,billableHours:durationHours,benefitApplied:input.internalAskPurpose==='official_activity'?'official_ask_activity':'board_private_booking',pricingRuleVersion:'internal-ask-free',manualOverride:false};
    return calculateBookingPrice({...input,bookingType:'ask_member'},{...context,privateBenefitAvailable:false});
  }
  const rule=findRule(input,context.rules);
  if(!rule)throw new AppError(400,'PRICING_RULE_NOT_FOUND','No active pricing rule is valid for the selected booking');
  return priceFromRule(input,rule,durationHours);
}
