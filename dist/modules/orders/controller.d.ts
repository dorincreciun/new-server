import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    checkout(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getOrders(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderDetails(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const orderController: OrderController;
//# sourceMappingURL=controller.d.ts.map