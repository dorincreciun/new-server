import { Request, Response, NextFunction } from 'express';
import { paths } from '../../docs/schema';
export declare class BrowseController {
    getProducts(req: Request<any, any, any, paths['/browse/products']['get']['parameters']['query']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getFilters(req: Request<any, any, any, paths['/browse/filters']['get']['parameters']['query']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const browseController: BrowseController;
//# sourceMappingURL=controller.d.ts.map