import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

import { DURATIONS } from '../config/constants';
import { env } from '../config/env';
import { JWT_CONFIG } from '../config/security';
import { AppError } from '../errors/AppError';
import { Session } from '../models/session.model';
import { User } from '../models/user.model';
import { LoginDto, RegisterDto } from '../schemas/auth.schema';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: JWT_CONFIG.access.expiresIn,
  });
};

export const generateRefreshToken = (sessionId: string) => {
  return jwt.sign({ sessionId }, env.jwtRefreshSecret, {
    expiresIn: JWT_CONFIG.refresh.expiresIn,
  });
};

export const rotateRefreshToken = async (oldToken: string) => {
  const decoded = jwt.verify(oldToken, env.jwtRefreshSecret) as { sessionId: string };
  const session = await Session.findById(decoded.sessionId);
  if (!session) throw new AppError('Invalid session', 401);

  try {
    const refreshToken = generateRefreshToken(session.id);
    session.refreshToken = refreshToken;
    session.expiresAt = new Date(Date.now() + DURATIONS.jwt.refresh);
    await session.save();

    const accessToken = generateAccessToken(session.userId.toHexString());
    return { accessToken, refreshToken };
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;
    throw new AppError('Invalid refresh token', 401);
  }
};

export const registerUser = async (data: RegisterDto) => {
  const { email, password } = data;
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already exists', 400);

  try {
    const hashed = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashed });
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;
    if (e instanceof MongoServerError && e.code === 11000) {
      throw new AppError('Email already exists', 400);
    }
    if (e instanceof mongoose.Error.ValidationError) {
      throw new AppError('Validation error', 400);
    }
    throw new AppError('Registration failed', 500);
  }
};

export const loginUser = async (data: LoginDto, req: Request) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  try {
    const session = await Session.create({
      userId: user._id,
      refreshToken: 'temporary',
      ip: 'req.ip',
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + DURATIONS.jwt.refresh),
    });

    const refreshToken = generateRefreshToken(session.id);
    session.refreshToken = refreshToken;
    await session.save();

    const accessToken = generateAccessToken(user._id.toString());
    return { accessToken, refreshToken, user };
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;
    // bcrypt error
    if (e instanceof Error && e.message.includes('data and hash arguments required')) {
      throw new AppError('Invalid credentials', 401);
    }
    if (e instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError('Login failed', 500);
  }
};

export const logoutAllDevices = async (userId: string) => {
  try {
    await Session.deleteMany({ userId });
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;
    throw new AppError('Logout failed', 500);
  }
};
