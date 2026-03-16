// src/config/security.ts
import type { CookieOptions } from 'express';

import { DURATIONS } from './constants';
import { env } from './env';

export const JWT_CONFIG = {
  access: {
    expiresIn: DURATIONS.jwt.access,
  },
} as const;

export const cookieOptions = {
  auth(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.isProd,
      sameSite: env.isProd ? 'strict' : 'lax',
      maxAge: DURATIONS.cookies.auth, // in ms
      // domain: env.isProd ? '.yourdomain.com' : undefined,
      // path: '/',
    };
  },
} as const;
