export const errorResponse=(error:unknown)=>({ok:false,status:500,error:error instanceof Error?error.message:String(error)});
