import mongoose from 'mongoose';

import { env } from './env';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.dbUrl);
    console.log('MongoDB connected');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('MongoDB connection error:', e.message);
    } else {
      console.error('MongoDB connection error:', e);
    }
    process.exit(1);
  }
};
