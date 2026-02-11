import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/container';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const authService = serviceContainer.getAuthService();
    const decoded = await authService.verifyToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
};
