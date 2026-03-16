import ms from 'ms';

export const DURATIONS = {
  jwt: {
    access: ms('1d'), // 1 day in ms
    // refresh: 7 * MS.day, // example if you add refresh tokens later
  },
  cookies: {
    auth: ms('1d'), // 1 day in ms
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
} as const;

export const HEADER_NAMES = {
  authorization: 'authorization',
} as const;
