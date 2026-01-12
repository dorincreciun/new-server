import { Request, Response, NextFunction } from 'express';
export declare class TaxonomiesController {
    getIngredients(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getFlags(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getDoughTypes(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getSizeOptions(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=route.d.ts.map