import { Request, Response, NextFunction } from 'express';
export declare class TaxonomiesController {
    getIngredients(req: Request, res: Response, next: NextFunction): Promise<any>;
    getFlags(req: Request, res: Response, next: NextFunction): Promise<any>;
    getDoughTypes(req: Request, res: Response, next: NextFunction): Promise<any>;
    getSizeOptions(req: Request, res: Response, next: NextFunction): Promise<any>;
}
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=route.d.ts.map