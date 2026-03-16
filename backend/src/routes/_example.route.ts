import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, _res: Response) => {
  // logic
});

export default router;
