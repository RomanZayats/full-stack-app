import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { logger } from '../config/logger';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Normalize unknown error
  const isApp = err instanceof AppError;
  const status = isApp ? err.statusCode : 500;
  const message = isApp ? err.message : 'Internal Server Error';

  logger.error({ err, reqId: req.id }, 'Unhandled error');

  res.status(status).json({ status: 'error', message });
};
