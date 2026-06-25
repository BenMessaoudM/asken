import { BookingStatus, OpeningHours, ResourcePayload } from './types'
export const localDate=(value?:string)=>value?new Date(new Date(value).getTime()-new Date(value).getTimezoneOffset()*60000).toISOString().slice(0,16):''
export const defaultOpeningHours=():OpeningHours[]=>[1,2,3,4,5].map((weekday)=>({weekday,start:'08:00',end:'22:00'}))
const localized=()=>({en:'',sv:'',fi:''});
export const emptyResource=():ResourcePayload=>({name:localized(),floor:localized(),description:localized(),location:localized(),rules:localized(),capacity:1,accessibility:localized(),active:true,requiresApproval:true,minDurationMinutes:30,maxDurationMinutes:720,advanceBookingDays:365,openingHours:defaultOpeningHours(),blackoutPeriods:[]})
export const statusTone=(status:BookingStatus)=>['approved','signed','completed'].includes(status)?'bg-green-100 text-green-800':['submitted','quote_requested','quote_sent','contract_generated','waiting_for_signature'].includes(status)?'bg-amber-100 text-amber-800':['rejected','cancelled'].includes(status)?'bg-red-100 text-red-800':'bg-gray-100 text-gray-700'
