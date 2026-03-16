import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import type { AppJwtPayload } from '../types/auth';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  const token = bearer ?? req.cookies?.token;

  if (!token) throw new AppError('No token', 401);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AppJwtPayload;
    req.user = decoded;
    next();
  } catch (e: unknown) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    if (e instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError('Authentication failed', 500);
  }
};
