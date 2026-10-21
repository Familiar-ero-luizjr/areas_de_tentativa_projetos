import mongoose,{Schema} from 'mongoose';
const schema = new Schema({userId:{type:String,required:true,unique:true},name:{type:String,required:true},phone:String,username:String,cpf:String,birthDate:String,gender:String,address:Schema.Types.Mixed,onboarding:{location:String,contactPreference:String,contactTime:String,completed:{type:Boolean,default:false}},updatedAt:String},{timestamps:false});
export const ClientModel=mongoose.model('Client',schema);
