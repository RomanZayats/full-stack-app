import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { COOKIE_NAMES } from '../config/constants';
import { env } from '../config/env';
import { cookieOptions } from '../config/security';
import { AppError } from '../errors/AppError';
import { Session } from '../models/session.model';
import { LoginDto, RegisterDto } from '../schemas/auth.schema';
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  logoutAllDevices,
} from '../services/auth.service';

export const register = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = res.locals.body as RegisterDto;
    const user = await registerUser(data);
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = res.locals.body as LoginDto;
    const { refreshToken, user } = await loginUser(data, req);

    res.cookie(COOKIE_NAMES.refresh, refreshToken, cookieOptions.refresh());

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

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh = req.cookies[COOKIE_NAMES.refresh];
    if (!refresh) return res.status(401).json({ message: 'No refresh token' });

    const { accessToken, refreshToken: newRefresh } = await rotateRefreshToken(refresh);

    res.cookie(COOKIE_NAMES.refresh, newRefresh, cookieOptions.refresh());
    res.status(200).json({ token: accessToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh = req.cookies[COOKIE_NAMES.refresh];
    if (!refresh) return res.status(200).json({ message: 'Logged out' });

    const decoded = jwt.verify(refresh, env.jwtRefreshSecret) as { sessionId: string };
    await Session.deleteOne({ _id: decoded.sessionId });

    res.clearCookie(COOKIE_NAMES.refresh, cookieOptions.refresh());
    res.status(200).json({ message: 'Logged out' });
  } catch (e) {
    next(e);
  }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  try {
    await logoutAllDevices(req.user.id);
    res.clearCookie(COOKIE_NAMES.refresh, cookieOptions.refresh());
    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (e) {
    next(e);
  }
};
