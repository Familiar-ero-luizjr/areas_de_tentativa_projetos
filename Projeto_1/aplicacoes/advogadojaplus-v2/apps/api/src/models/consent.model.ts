import mongoose,{Schema} from 'mongoose';
const schema = new Schema({id:{type:String,required:true,unique:true},userId:{type:String,required:true,index:true},document:{type:String,required:true},version:{type:String,required:true},acceptedAt:{type:String,required:true}},{timestamps:true});
export const ConsentModel=mongoose.model('Consent',schema);
