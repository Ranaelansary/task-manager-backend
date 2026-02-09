import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }));

        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_ERROR, formattedErrors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
