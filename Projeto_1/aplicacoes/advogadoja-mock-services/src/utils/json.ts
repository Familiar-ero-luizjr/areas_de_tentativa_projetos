export const prettyJson=(value:unknown)=>JSON.stringify(value,null,2); export const safeParse=(text:string)=>{try{return JSON.parse(text)}catch{return null}};
