import { ErrorRequestHandler, RequestHandler } from 'express';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new AppError(404, 'NOT_FOUND', 'Resource not found'));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  let appError: AppError;
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof SyntaxError && 'body' in error) {
    appError = new AppError(400, 'INVALID_JSON', 'Request body contains invalid JSON');
  } else {
    appError = new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  }

  response.status(appError.status).json({
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details === undefined ? {} : { details: appError.details }),
      requestId: response.locals.requestId,
    },
  });
};
