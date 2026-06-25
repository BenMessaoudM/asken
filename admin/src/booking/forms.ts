import { BookingStatus, OpeningHours, ResourcePayload } from './types'
export const localDate=(value?:string)=>value?new Date(new Date(value).getTime()-new Date(value).getTimezoneOffset()*60000).toISOString().slice(0,16):''
export const defaultOpeningHours=():OpeningHours[]=>[1,2,3,4,5].map((weekday)=>({weekday,start:'08:00',end:'22:00'}))
export const emptyResource=():ResourcePayload=>({name:{en:'',sv:''},description:{en:'',sv:''},location:{en:'',sv:''},rules:{en:'',sv:''},capacity:1,accessibility:{en:'',sv:''},active:true,requiresApproval:true,minDurationMinutes:30,maxDurationMinutes:240,advanceBookingDays:90,openingHours:defaultOpeningHours(),blackoutPeriods:[]})
export const statusTone=(status:BookingStatus)=>status==='approved'?'bg-green-100 text-green-800':status==='pending'?'bg-amber-100 text-amber-800':status==='rejected'?'bg-red-100 text-red-800':'bg-gray-100 text-gray-700'
