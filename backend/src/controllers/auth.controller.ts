import type { Request, Response, NextFunction } from 'express';

import { COOKIE_NAMES } from '../config/constants';
import { cookieOptions } from '../config/security';
import { LoginDto, RegisterDto } from '../schemas/auth.schema';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = res.locals.body as RegisterDto;
    const user = await registerUser(data);
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};

export const login = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = res.locals.body as LoginDto;
    const { token, user } = await loginUser(data);

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
