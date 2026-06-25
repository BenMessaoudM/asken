import { getJson, postJson } from '../api/client'
import { BookingLocale, BookingRequest, BookingResource, BookingStatusRecord } from './types'
export const listBookingResources=(locale:BookingLocale)=>getJson<{data:{resources:BookingResource[]}}>(`/bookings/resources?locale=${locale}`)
export const getAvailability=(resourceId:string,from:string,to:string)=>getJson<{data:{intervals:Array<{startAt:string;endAt:string;kind:'booking'|'blackout'}>}}>(`/bookings/availability?resourceId=${resourceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
export const createBooking=(input:BookingRequest)=>postJson<{data:{booking:BookingStatusRecord;accessCode:string}}>('/bookings',input)
export const getBookingStatus=(reference:string,accessCode:string,locale:BookingLocale)=>postJson<{data:{booking:BookingStatusRecord}}>('/bookings/status',{reference,accessCode,locale})
