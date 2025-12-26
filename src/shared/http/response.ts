import { Response } from 'express';

export interface SuccessResponse<T = any> {
  message: string;
  data: T;
  meta?: any;
}

export interface ErrorResponse {
  message: string;
  code: string;
  details?: Array<{ field: string; message: string }>;
}

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', status = 200, meta?: any) => {
  return res.status(status).json({
    message,
    data,
    meta,
  } as SuccessResponse<T>);
};

export const sendError = (res: Response, message: string, code = 'INTERNAL_ERROR', status = 500, details?: any) => {
  return res.status(status).json({
    message,
    code,
    details,
  } as ErrorResponse);
};
