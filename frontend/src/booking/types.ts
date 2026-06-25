export type BookingLocale = 'en' | 'sv'
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export interface BookingResource { id:string;slug:string;name:string;description:string;location:string;rules:string;capacity:number;accessibility:string;imageUrl?:string;requiresApproval:boolean;minDurationMinutes:number;maxDurationMinutes:number;advanceBookingDays:number;openingHours:Array<{weekday:number;start:string;end:string}> }
export interface BookingStatusRecord { reference:string;status:BookingStatus;resource:BookingResource;startAt:string;endAt:string;requesterName:string;purpose:string;publicNotes?:string;createdAt:string;updatedAt:string }
export interface BookingRequest { resourceId:string;startAt:string;endAt:string;requesterName:string;requesterEmail:string;requesterPhone?:string;organization?:string;purpose:string;attendees:number;accessibilityNeeds?:string;locale:BookingLocale;privacyAccepted:true }
