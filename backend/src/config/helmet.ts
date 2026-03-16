import type { HelmetOptions } from 'helmet';

export const helmetOptions: HelmetOptions = {
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },
  frameguard: { action: 'sameorigin' },
  dnsPrefetchControl: { allow: false },
  hidePoweredBy: true,
};
