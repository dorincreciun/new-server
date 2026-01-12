import { Request, Response, NextFunction } from 'express';
export declare class BrowseController {
    getProducts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getFilters(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getSuggestions(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const browseController: BrowseController;
//# sourceMappingURL=controller.d.ts.map