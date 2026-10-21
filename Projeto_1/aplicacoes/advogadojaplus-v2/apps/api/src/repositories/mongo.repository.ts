import type {DataRepository} from './contracts.js';
import type {Account,Client,Consent,Session,Professional} from '../types/domain.js';
import {AccountModel,ClientModel,ConsentModel,SessionModel,ProfessionalModel} from '../models/index.js';
import mongoose from 'mongoose';
export class MongoRepository implements DataRepository {
  async findAccount(email:string){const a=await AccountModel.findOne({email:email.trim().toLowerCase()}).select('+passwordHash').lean();return a?toAccount(a):null;}
  async findAccountById(id:string){const a=await AccountModel.findById(id).select('+passwordHash').lean();return a?toAccount(a):null;}
  async createAccount(a:Account,c:Client,consents:Consent[]){
    const session=await mongoose.startSession();
    try{await session.withTransaction(async()=>{
      await AccountModel.create([{_id:a.id,...a}],{session});
      await ClientModel.create([c],{session});
      if(consents.length)await ConsentModel.insertMany(consents,{session});
    });}finally{await session.endSession();}
  }
  async getClient(id:string):Promise<Client|null>{const c=await ClientModel.findOne({userId:id}).lean();return c?{userId:c.userId,name:c.name,phone:c.phone??undefined,username:c.username??undefined,cpf:c.cpf??undefined,birthDate:c.birthDate??undefined,gender:c.gender??undefined,address:c.address??undefined,onboarding:{location:c.onboarding?.location??undefined,contactPreference:c.onboarding?.contactPreference??undefined,contactTime:c.onboarding?.contactTime??undefined,completed:c.onboarding?.completed??false},updatedAt:c.updatedAt??new Date().toISOString()}:null;}
  async saveClient(c:Client){const r=await ClientModel.updateOne({userId:c.userId},{$set:c});if(!r.matchedCount)throw new Error('CLIENT_NOT_FOUND');}
  async createSession(s:Session){await SessionModel.create({...s,expiresAt:new Date(s.expiresAt)});}
  async findSession(h:string){const s=await SessionModel.findOne({tokenHash:h,expiresAt:{$gt:new Date()}}).lean();return s?{tokenHash:s.tokenHash,userId:s.userId,expiresAt:s.expiresAt.toISOString()}:null;}
  async revokeSession(h:string){await SessionModel.deleteOne({tokenHash:h});}
  async listConsents(id:string){const xs=await ConsentModel.find({userId:id}).lean();return xs.map(x=>({id:x.id,userId:x.userId,document:x.document,version:x.version,acceptedAt:x.acceptedAt}));}
  async listProfessionals():Promise<Professional[]>{const xs=await ProfessionalModel.find({}).sort({name:1}).lean();return xs.map(x=>({id:String(x._id),name:x.name,area:x.area,city:x.city,rating:x.rating}));}
}
function toAccount(a:any):Account{return {id:String(a._id),email:a.email,passwordHash:a.passwordHash,role:a.role,name:a.name,status:a.status,createdAt:a.createdAt instanceof Date?a.createdAt.toISOString():String(a.createdAt??new Date().toISOString())};}
