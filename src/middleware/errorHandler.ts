import { Request, Response, NextFunction } from 'express';

// Custom error type to extend built-in Error with statusCode
interface CustomError extends Error {
  statusCode?: number;
}

// Error handling middleware
export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): void {
  console.error(err.stack); // ✅ Log error stack for debugging

  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong!'
  });
}
