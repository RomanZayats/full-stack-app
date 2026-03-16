import type { Request, Response, NextFunction } from 'express';

import { COOKIE_NAMES } from '../config/constants';
import { cookieOptions } from '../config/security';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(res.locals.body.email, res.locals.body.password);
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, user } = await loginUser(res.locals.body.email, res.locals.body.password);

    res.cookie(COOKIE_NAMES.auth, token, cookieOptions.auth());

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        // created_at: user.created_at,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAMES.auth, cookieOptions.auth());
  res.status(200).json({ message: 'Logged out' });
};
