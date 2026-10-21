export type Professional={id:string;name:string;area:string;city:string;rating:number};export interface ProfessionalsRepository{list():Promise<Professional[]>}
