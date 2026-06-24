import { model, Schema } from 'mongoose';
const schema=new Schema({slug:{type:String,required:true,unique:true,lowercase:true},labels:{en:{type:String,required:true},sv:{type:String,required:true}},schemaVersion:{type:Number,default:1}},{timestamps:true});
export const EventCategoryModel=model('EventCategory',schema);
