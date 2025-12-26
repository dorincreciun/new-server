import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
export declare const validate: (schema: {
    body?: ZodTypeAny;
    query?: ZodTypeAny;
    params?: ZodTypeAny;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.d.ts.map