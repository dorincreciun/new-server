import { Request, Response, NextFunction } from 'express';
import { paths } from '../../docs/schema';
export declare class CartController {
    getCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    addItem(req: Request<any, any, paths['/cart/items']['post']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateItem(req: Request<any, any, paths['/cart/items/{itemId}']['patch']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    removeItem(req: Request<any>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    clearCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const cartController: CartController;
//# sourceMappingURL=controller.d.ts.map