import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type SchemaContainer = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export const validate =
  <T extends SchemaContainer>(schemas: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const parsed = schemas.body.parse(req.body);
        res.locals.body = parsed as z.infer<T['body']>;
      }

      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        res.locals.query = parsed as z.infer<T['query']>;
      }

      if (schemas.params) {
        const parsed = schemas.params.parse(req.params);
        res.locals.params = parsed as z.infer<T['params']>;
      }

      next();
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: z.treeifyError(e),
        });
      }
      next(e);
    }
  };
