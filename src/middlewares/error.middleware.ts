import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: Error | ApiError, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error occurred', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error',
      errors: null,
    });
  }
};
