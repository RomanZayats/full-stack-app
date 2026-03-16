import type { Request, Response, NextFunction } from 'express';

export const example = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //logic
  } catch (e) {
    next(e);
  }
};
