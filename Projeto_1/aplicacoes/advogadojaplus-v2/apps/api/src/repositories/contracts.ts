import type {Account,Client,Consent,Session,Professional} from '../types/domain.js';
/** All callers see the same semantics, regardless of MongoDB Atlas or mock. */
export interface DataRepository {
  findAccount(email:string):Promise<Account|null>;
  findAccountById(id:string):Promise<Account|null>;
  createAccount(account:Account, client:Client, consents:Consent[]):Promise<void>;
  getClient(userId:string):Promise<Client|null>;
  saveClient(client:Client):Promise<void>;
  createSession(session:Session):Promise<void>;
  findSession(tokenHash:string):Promise<Session|null>;
  revokeSession(tokenHash:string):Promise<void>;
  listConsents(userId:string):Promise<Consent[]>;
  listProfessionals():Promise<Professional[]>;
}
