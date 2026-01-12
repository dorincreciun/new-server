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
export declare function sendSuccess<T, TMeta = any>(res: Response, data: T, message?: string, status?: number, meta?: TMeta): Response;
export declare function sendError(res: Response, message: string, code?: string, status?: number, details?: Array<{
    field: string;
    message: string;
}>): Response;
//# sourceMappingURL=response.d.ts.map