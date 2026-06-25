import { model, Schema, Types } from 'mongoose';
const schema=new Schema({bookingId:{type:Types.ObjectId,ref:'Booking',required:true,index:true},bookingReference:{type:String,required:true,index:true},generatedBy:{type:Types.ObjectId,ref:'User',required:true},generatedAt:{type:Date,required:true,default:Date.now},language:{type:String,enum:['en','sv','fi'],required:true},templateVersion:{type:String,required:true},termsVersion:{type:String,required:true},status:{type:String,enum:['contract_generated','waiting_for_signature','signed'],required:true}},{versionKey:false});
schema.index({bookingId:1,generatedAt:-1});
export const BookingContractModel=model('BookingContract',schema);
