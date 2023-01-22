import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exeptions/api-error.js';

export function errorMiddleware(error: ApiError, req: Request, res: Response, next: NextFunction) {
  if (!error) return next();
  console.log(error);
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message, errors: error.errors });
  }
  return res.status(500).json({ message: 'Unknown server error' });
}
