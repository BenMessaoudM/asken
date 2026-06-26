import { getJson,postJson } from '../api/client';
import { BookingCategory,BookingLocale,BookingRequest,BookingResource,BookingStatusRecord,PriceBreakdown,PricingRequest } from './types';
export const listBookingCategories=(locale:BookingLocale)=>getJson<{data:{categories:BookingCategory[]}}>("/bookings/categories?locale="+locale);
export const listBookingResources=(locale:BookingLocale)=>getJson<{data:{resources:BookingResource[]}}>(`/bookings/resources?locale=${locale}`);
export const getAvailability=(resourceId:string,from:string,to:string)=>getJson<{data:{intervals:Array<{startAt:string;endAt:string;kind:'booking'|'blackout'}>}}>(`/bookings/availability?resourceId=${resourceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
export const calculatePrice=(input:PricingRequest)=>postJson<{data:{price:PriceBreakdown}}>('/bookings/price',input);
export const createBooking=(input:BookingRequest)=>postJson<{data:{booking:BookingStatusRecord}}>('/bookings',input);
export const getBookingStatus=(reference:string,email:string,locale:BookingLocale)=>postJson<{data:{booking:BookingStatusRecord}}>('/bookings/status',{reference,email,locale});
