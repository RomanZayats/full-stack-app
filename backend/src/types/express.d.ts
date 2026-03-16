import 'express-serve-static-core';

import type { AppJwtPayload } from './auth';

interface RequestMeta {
  id: string;
}

declare module 'express-serve-static-core' {
  interface Request extends RequestMeta {
    user?: AppJwtPayload;
  }
}
