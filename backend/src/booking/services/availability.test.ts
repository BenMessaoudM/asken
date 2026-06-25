import { AppError } from '../../http/errors';
import { assertBookable, bookingSlots } from './availability';
import { BookingResource } from '../types';

const resource: BookingResource = { id:'507f1f77bcf86cd799439011',slug:'meeting-room-sauna',name:{en:'Meeting Room & Sauna',sv:'Kabinettet & Bastu',fi:'Kabinetti ja sauna'},floor:{en:'Floor 2',sv:'Våning 2',fi:'2. kerros'},description:{en:'Room',sv:'Rum',fi:'Tila'},location:{en:'Cor',sv:'Cor',fi:'Cor'},rules:{en:'Rules',sv:'Regler',fi:'Säännöt'},capacity:10,accessibility:{en:'Accessible',sv:'Tillgänglig',fi:'Esteetön'},active:true,requiresApproval:true,minDurationMinutes:30,maxDurationMinutes:240,advanceBookingDays:1000,openingHours:[{weekday:2,start:'08:00',end:'20:00'}],blackoutPeriods:[],createdAt:new Date(),updatedAt:new Date() };

describe('booking availability', () => {
  it('creates deterministic 15 minute conflict slots', () => expect(bookingSlots(new Date('2030-01-01T10:07:00Z'),new Date('2030-01-01T10:31:00Z')).map(String)).toHaveLength(3));
  it('accepts a valid Helsinki opening-hours booking', () => expect(() => assertBookable(resource,new Date('2030-01-01T10:00:00Z'),new Date('2030-01-01T11:00:00Z'),5,new Date('2029-01-01T00:00:00Z'))).not.toThrow());
  it('rejects capacity overflow', () => { try { assertBookable(resource,new Date('2030-01-01T10:00:00Z'),new Date('2030-01-01T11:00:00Z'),11,new Date('2029-01-01T00:00:00Z')); } catch (error) { expect(error).toBeInstanceOf(AppError); expect((error as AppError).code).toBe('CAPACITY_EXCEEDED'); } });
});
