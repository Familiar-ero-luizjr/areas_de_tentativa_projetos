import { mapsService } from "../maps.service"; export const calculateDistance=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>mapsService.distance(a,b);
