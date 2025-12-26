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
export declare function success<T = any, M = any>(data?: T, message?: string, meta?: M): StandardResponse<T, M>;
export declare function error(message: string, status?: number, details?: ErrorDetail[]): StandardResponse<null, undefined> & {
    status?: number;
    details?: ErrorDetail[];
};
//# sourceMappingURL=responseWrapper.d.ts.map