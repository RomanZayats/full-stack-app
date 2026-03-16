import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

import { env } from '../config/env';
import { JWT_CONFIG } from '../config/security';
import { AppError } from '../errors/AppError';
import { User } from '../models/user.model';

export const registerUser = async (email: string, password: string) => {
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

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  try {
    const token = jwt.sign({ id: user._id }, env.jwtSecret as string, {
      expiresIn: JWT_CONFIG.access.expiresIn,
    });
    return { token, user };
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;

    // bcrypt error
    if (e instanceof Error && e.message.includes('data and hash arguments required')) {
      throw new AppError('Invalid credentials', 401);
    }

    // jwt error
    if (e instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }

    throw new AppError('Login failed', 500);
  }
};
