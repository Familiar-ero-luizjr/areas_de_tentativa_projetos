import type { RemoteConfigGateway } from "../../contracts/RemoteConfigGateway"; import { remoteConfigStore } from "./remoteConfig.store";
export class MockRemoteConfigGateway implements RemoteConfigGateway { get<T=unknown>(key:string){return remoteConfigStore[key] as T|undefined;} set(key:string,value:unknown){remoteConfigStore[key]=value;} async fetchAndActivate(){return true;} }
