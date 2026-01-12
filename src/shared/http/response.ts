import { Response } from 'express';

export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
  meta?: any;
}

export interface ErrorResponse {
  message: string;
  code: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export function sendSuccess<T, TMeta = any>(
  res: Response,
  data: T,
  message: string = 'Success',
  status: number = 200,
  meta?: TMeta
): Response {
  const response: any = {
    message,
    data,
  };
  if (meta !== undefined) {
    response.meta = meta;
  }
  return res.status(status).json(response);
}

export function sendError(
  res: Response,
  message: string,
  code: string = 'INTERNAL_ERROR',
  status: number = 500,
  details?: Array<{ field: string; message: string }>
): Response {
  return res.status(status).json({
    message,
    code,
    ...(details ? { details } : {}),
  });
}
