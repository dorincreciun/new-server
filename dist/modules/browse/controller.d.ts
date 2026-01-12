import { Request, Response, NextFunction } from 'express';
export declare class BrowseController {
    getProducts(req: Request, res: Response, next: NextFunction): Promise<any>;
    getFilters(req: Request, res: Response, next: NextFunction): Promise<any>;
    getSuggestions(req: Request, res: Response, next: NextFunction): Promise<any>;
}
export declare const browseController: BrowseController;
//# sourceMappingURL=controller.d.ts.map