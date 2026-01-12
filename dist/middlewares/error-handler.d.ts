import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/http/errors';
export declare function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
//# sourceMappingURL=error-handler.d.ts.map