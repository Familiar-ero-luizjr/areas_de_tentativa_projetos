import type { StorageGateway } from "../../contracts/StorageGateway";
const files=new Map<string,{content:Blob|string,url:string}>();
export class MockStorageGateway implements StorageGateway {
  async upload(path:string,content:Blob|string){ const url=`mock://storage/${encodeURIComponent(path)}`; files.set(path,{content,url}); return {path,url}; }
  async remove(path:string){ return files.delete(path); }
  list(){ return [...files.entries()].map(([path,v])=>({path,url:v.url})); }
}
