import type { MapsGateway, LatLng } from "../../contracts/MapsGateway"; import { appConfig } from "../../app/config";
export class MockMapsGateway implements MapsGateway {
  async currentLocation():Promise<LatLng>{ return {...appConfig.defaultLocation}; }
  async geocode(address:string):Promise<LatLng>{ let hash=0; for(const c of address) hash=(hash*31+c.charCodeAt(0))|0; return {lat:appConfig.defaultLocation.lat+(hash%1000)/100000,lng:appConfig.defaultLocation.lng+((hash>>4)%1000)/100000}; }
  async distance(a:LatLng,b:LatLng){ const R=6371; const rad=(v:number)=>v*Math.PI/180; const dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng); const s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)); }
}
