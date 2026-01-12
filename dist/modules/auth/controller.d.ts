import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    register(req: Request, res: Response, next: NextFunction): Promise<any>;
    login(req: Request, res: Response, next: NextFunction): Promise<any>;
    refresh(req: Request, res: Response, next: NextFunction): Promise<any>;
    me(req: Request, res: Response, next: NextFunction): Promise<any>;
    logout(req: Request, res: Response, next: NextFunction): Promise<any>;
}
export declare const authController: AuthController;
//# sourceMappingURL=controller.d.ts.map