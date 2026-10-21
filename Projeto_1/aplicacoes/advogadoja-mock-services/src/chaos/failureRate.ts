export const shouldFail=(rate:number,random=Math.random)=>random()<Math.max(0,Math.min(rate,1));
