import { Request, Response, NextFunction } from 'express';
export declare class CategoriesController {
    list(req: Request, res: Response, next: NextFunction): Promise<any>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<any>;
    create(req: Request, res: Response, next: NextFunction): Promise<any>;
    update(req: Request, res: Response, next: NextFunction): Promise<any>;
    remove(req: Request, res: Response, next: NextFunction): Promise<any>;
}
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=route.d.ts.map