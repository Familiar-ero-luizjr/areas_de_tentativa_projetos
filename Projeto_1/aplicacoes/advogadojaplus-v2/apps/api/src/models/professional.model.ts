import mongoose,{Schema} from 'mongoose';
const schema = new Schema({_id:{type:String,required:true},name:{type:String,required:true},area:{type:String,required:true},city:{type:String,required:true},rating:{type:Number,required:true,min:0,max:5}},{timestamps:true});
export const ProfessionalModel=mongoose.model('Professional',schema);
