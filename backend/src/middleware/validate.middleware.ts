import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type Schemas = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export const validate = (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      res.locals.body = schemas.body.parse(req.body);
    }

    if (schemas.query) {
      res.locals.query = schemas.query.parse(req.query);
    }

    if (schemas.params) {
      res.locals.params = schemas.params.parse(req.params);
    }

    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: e.flatten(),
      });
    }
    next(e);
  }
};
