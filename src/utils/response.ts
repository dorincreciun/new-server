export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StandardResponse<TData = unknown, TMeta = unknown> = {
  success: boolean;
  message?: string;
  data?: TData;
  meta?: TMeta;
};

export function ok<TData, TMeta = undefined>(
  data: TData,
  options?: { message?: string; meta?: TMeta }
): StandardResponse<TData, TMeta> {
  const { message, meta } = options || {} as any;
  const res: any = { success: true };
  if (message) res.message = message;
  if (typeof data !== 'undefined') res.data = data;
  if (typeof meta !== 'undefined') res.meta = meta as any;
  return res as StandardResponse<TData, TMeta>;
}

export function success(message?: string): StandardResponse<undefined, undefined> {
  return { success: true, ...(message ? { message } : {}) };
}

export function created<TData, TMeta = undefined>(
  data: TData,
  options?: { message?: string; meta?: TMeta }
): StandardResponse<TData, TMeta> {
  return ok(data, options);
}
