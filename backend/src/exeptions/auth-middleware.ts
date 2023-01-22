import { NextFunction, Request, Response } from 'express';
import { tokenService } from '../services/auth/services/token-service.js';
import { ApiError } from './api-error.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const tokenData = tokenService.validateAccessToken(accessToken);

    if (!tokenData) {
      return next(ApiError.UnauthorizedError());
    }
    // req.user = tokenData;
    return next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}
