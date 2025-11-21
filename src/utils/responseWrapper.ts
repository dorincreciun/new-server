
export interface StandardResponse<T = any, M = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: M;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export function success<T = any, M = any>(data?: T, message?: string, meta?: M): StandardResponse<T, M> {
  return {
    success: true,
    ...(message !== undefined ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta !== undefined ? { meta } : {}),
  };
}

export function error(
  message: string,
  status: number = 400,
  details?: ErrorDetail[]
): StandardResponse<null, undefined> & { status?: number; details?: ErrorDetail[] } {
  return {
    success: false,
    message,
    data: null,
    status,
    ...(details ? { details } : {}),
  };
}


