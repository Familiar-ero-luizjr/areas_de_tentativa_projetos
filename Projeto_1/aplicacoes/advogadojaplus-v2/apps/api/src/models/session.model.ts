import mongoose,{Schema} from 'mongoose';
const schema = new Schema({tokenHash:{type:String,required:true,unique:true},userId:{type:String,required:true,index:true},expiresAt:{type:Date,required:true}});
schema.index({expiresAt:1},{expireAfterSeconds:0});
export const SessionModel=mongoose.model('Session',schema);
