import { Request, Response, NextFunction } from 'express';
import { Database } from '../config/database';
import { AppError } from '../utils/AppError';

export const checkDatabaseConnection = (_req: Request, _res: Response, next: NextFunction): void => {
  const database = Database.getInstance();
  
  if (!database.isConnectedToDatabase()) {
    return next(new AppError('Database connection not established', 503));
  }
  
  next();
};