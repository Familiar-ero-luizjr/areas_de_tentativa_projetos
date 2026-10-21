import { mapsService } from "../maps.service"; export const geocode=(address:string)=>mapsService.geocode(address);
