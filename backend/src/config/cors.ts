import type { CorsOptions } from 'cors';

import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: env.frontendOrigin,
  credentials: true,
};
