import { AppError } from '../errors/AppError';

export const exampleService = async () => {
  try {
    // logic
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;

    // (library mappings here...)

    throw new AppError('Service failed', 500);
  }
};
