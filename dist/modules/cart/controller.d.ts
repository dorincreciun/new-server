import { Request, Response, NextFunction } from 'express';
import { paths } from '../../docs/schema';
export declare class CartController {
    getCart(req: Request, res: Response, next: NextFunction): Promise<any>;
    addItem(req: Request<any, any, paths['/cart/items']['post']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<any>;
    updateItem(req: Request<any, any, paths['/cart/items/{itemId}']['patch']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<any>;
    removeItem(req: Request<any>, res: Response, next: NextFunction): Promise<any>;
    clearCart(req: Request, res: Response, next: NextFunction): Promise<any>;
}
export declare const cartController: CartController;
//# sourceMappingURL=controller.d.ts.map