import rateLimit from 'express-rate-limit';

import { RATE_LIMIT } from './constants';
import { logger } from './logger';

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.api.windowMs,
  limit: RATE_LIMIT.api.max,
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res /*, next*/) => {
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'API rate limit exceeded');
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.auth.windowMs,
  limit: RATE_LIMIT.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /*, next*/) => {
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'Auth rate limit exceeded');
    res.status(429).json({
      status: 'error',
      message: 'Too many login/register attempts, please try again later.',
    });
  },
});
