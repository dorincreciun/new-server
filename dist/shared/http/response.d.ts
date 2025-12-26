import { Response } from 'express';
export interface SuccessResponse<T = any> {
    message: string;
    data: T;
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
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, status?: number, meta?: any) => Response<any, Record<string, any>>;
export declare const sendError: (res: Response, message: string, code?: string, status?: number, details?: any) => Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map