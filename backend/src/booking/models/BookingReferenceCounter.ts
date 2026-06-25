import { model, Schema } from 'mongoose';
const schema=new Schema({year:{type:Number,required:true,unique:true},sequence:{type:Number,required:true,default:0}},{versionKey:false});
export const BookingReferenceCounterModel=model('BookingReferenceCounter',schema);
