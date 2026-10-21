import mongoose,{Schema} from 'mongoose';
const schema = new Schema({_id:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['cliente','advogado'],required:true},name:{type:String,required:true},status:{type:String,enum:['active','pending'],required:true}},{timestamps:true});
export const AccountModel=mongoose.model('Account',schema);
