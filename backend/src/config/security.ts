// src/config/security.ts
import type { CookieOptions } from 'express';

import { DURATIONS } from './constants';
import { env } from './env';

export const JWT_CONFIG = {
  access: {
    expiresIn: DURATIONS.jwt.access / 1000,
  },
  refresh: {
    expiresIn: DURATIONS.jwt.refresh / 1000,
  },
} as const;

export const cookieOptions = {
  refresh(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.isProd,
      sameSite: env.isProd ? 'strict' : 'lax',
      maxAge: DURATIONS.cookies.auth,
      path: '/auth/refresh',
      // domain: env.isProd ? '.yourdomain.com' : undefined,
    };
  },
} as const;
