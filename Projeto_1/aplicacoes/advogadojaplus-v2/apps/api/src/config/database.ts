import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {env} from './env.js';
import {MongoRepository} from '../repositories/mongo.repository.js';
import {MockRepository} from '../repositories/mock.repository.js';
import type {DataRepository} from '../repositories/contracts.js';
export async function createRepository():Promise<DataRepository>{
  if(env.DATA_PROVIDER==='mock'){
    const repo=new MockRepository(env.MOCK_DB_FILE);
    if(env.SEED_DEMO==='true' && !(await repo.findAccount('maria@exemplo.com'))){
      const id=randomUUID(),now=new Date().toISOString();
      await repo.createAccount({id,email:'maria@exemplo.com',name:'Maria (demonstração)',role:'cliente',status:'active',passwordHash:await bcrypt.hash('MariaTeste!2026',12),createdAt:now},
        {userId:id,name:'Maria (demonstração)',onboarding:{completed:true,location:'São Paulo',contactPreference:'WhatsApp'},updatedAt:now},[]);
    }
    return repo;
  }
  await mongoose.connect(env.MONGODB_URI!,{serverSelectionTimeoutMS:10000});
  return new MongoRepository();
}
