import ms from 'ms';

export const DURATIONS = {
  jwt: {
    access: ms('15m'),
    refresh: ms('7d'),
  },
  cookies: {
    auth: ms('7d'),
  },
} as const;

export const RATE_LIMIT = {
  api: {
    windowMs: 15 * ms('1m'),
    max: 100, // typical API default
  },
  auth: {
    windowMs: 10 * ms('1m'),
    max: 5, // stricter for login/register to deter brute force
  },
} as const;

export const COOKIE_NAMES = {
  auth: 'token',
  refresh: 'refreshToken',
} as const;

export const HEADER_NAMES = {
  authorization: 'authorization',
} as const;
