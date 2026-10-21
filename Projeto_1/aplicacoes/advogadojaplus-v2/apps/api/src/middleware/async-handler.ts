import type {RequestHandler} from 'express';
/** Encaminha falhas de handlers assíncronos ao middleware de erro do Express. */
export const asyncHandler = (handler:RequestHandler):RequestHandler =>
  (req,res,next) => Promise.resolve(handler(req,res,next)).catch(next);
