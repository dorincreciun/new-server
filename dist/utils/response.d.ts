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
export declare function ok<TData, TMeta = undefined>(data: TData, options?: {
    message?: string;
    meta?: TMeta;
}): StandardResponse<TData, TMeta>;
export declare function success(message?: string): StandardResponse<undefined, undefined>;
export declare function created<TData, TMeta = undefined>(data: TData, options?: {
    message?: string;
    meta?: TMeta;
}): StandardResponse<TData, TMeta>;
//# sourceMappingURL=response.d.ts.map