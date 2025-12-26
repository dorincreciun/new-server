import { Request, Response, NextFunction } from 'express';
import { paths } from '../../docs/schema';
export declare class AuthController {
    register(req: Request<any, any, paths['/auth/register']['post']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request<any, any, paths['/auth/login']['post']['requestBody']['content']['application/json']>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    refresh(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    me(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const authController: AuthController;
//# sourceMappingURL=controller.d.ts.map