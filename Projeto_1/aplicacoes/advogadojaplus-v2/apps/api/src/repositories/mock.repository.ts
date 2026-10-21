import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {DataRepository} from './contracts.js';
import type {Account,Client,Consent,Session,Professional} from '../types/domain.js';
import {demoProfessionals} from '../mocks/seeds.js';

type Database = {schemaVersion:1; accounts:Account[]; clients:Client[]; sessions:Session[]; consents:Consent[]; professionals:Professional[]};
const fresh = ():Database => ({schemaVersion:1,accounts:[],clients:[],sessions:[],consents:[],professionals:structuredClone(demoProfessionals)});
const clone = <T>(value:T):T => structuredClone(value);
/** Development-only local database. Same repository contract as Mongo, persisted on disk. */
export class MockRepository implements DataRepository {
  private db:Database;
  constructor(private readonly filePath?:string) {
    if(filePath && existsSync(filePath)) {
      const value:unknown=JSON.parse(readFileSync(filePath,'utf8'));
      if(!value || typeof value!=='object' || (value as Database).schemaVersion!==1 || !Array.isArray((value as Database).accounts)) throw new Error('Arquivo mock inválido: versão ou formato incompatível');
      this.db=clone(value as Database);
    } else this.db=fresh();
  }
  private persist() {
    if(!this.filePath)return;
    mkdirSync(dirname(this.filePath),{recursive:true});
    const tmp=`${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    writeFileSync(tmp,JSON.stringify(this.db,null,2),{encoding:'utf8',mode:0o600});
    renameSync(tmp,this.filePath);
  }
  async findAccount(email:string){return clone(this.db.accounts.find(x=>x.email===email.trim().toLowerCase())??null);}
  async findAccountById(id:string){return clone(this.db.accounts.find(x=>x.id===id)??null);}
  async createAccount(a:Account,c:Client,consents:Consent[]){
    if(this.db.accounts.some(x=>x.email===a.email.toLowerCase()))throw new Error('EMAIL_EXISTS');
    // Commit as one unit, like the MongoDB registration transaction.
    this.db.accounts.push(clone(a));this.db.clients.push(clone(c));this.db.consents.push(...clone(consents));this.persist();
  }
  async getClient(id:string){return clone(this.db.clients.find(x=>x.userId===id)??null);}
  async saveClient(c:Client){
    const index=this.db.clients.findIndex(x=>x.userId===c.userId);
    if(index<0)throw new Error('CLIENT_NOT_FOUND');
    this.db.clients[index]=clone(c);this.persist();
  }
  async createSession(s:Session){this.db.sessions.push(clone(s));this.persist();}
  async findSession(hash:string){return clone(this.db.sessions.find(x=>x.tokenHash===hash && Date.parse(x.expiresAt)>Date.now())??null);}
  async revokeSession(hash:string){this.db.sessions=this.db.sessions.filter(s=>s.tokenHash!==hash);this.persist();}
  async listConsents(id:string){return clone(this.db.consents.filter(c=>c.userId===id));}
  async listProfessionals(){return clone(this.db.professionals);}
}
