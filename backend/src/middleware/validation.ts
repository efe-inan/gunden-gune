import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new AppError(errorMessage, 400, error.issues));
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new AppError(errorMessage, 400, error.issues));
      } else {
        next(error);
      }
    }
  };
};
