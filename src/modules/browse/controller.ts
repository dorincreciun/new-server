import {Request, Response, NextFunction} from 'express';
import {browseService} from './service';
import {sendSuccess} from '../../shared/http/response';
import {components} from '../../docs/schema';

type ProductResponse = components["schemas"]["ProductDetails"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export class BrowseController {
    async getProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {products, pagination, filters} = await browseService.getProducts(req.query as any);
            return sendSuccess<ProductResponse[], any>(
                res,
                products,
                'Products found',
                200,
                { pagination, filters }
            );
        } catch (error) {
            next(error);
        }
    }

    async searchProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {products, pagination} = await browseService.searchProducts(req.query as any);
            return sendSuccess<ProductResponse[], any>(
                res,
                products,
                'Products found by search',
                200,
                { pagination }
            );
        } catch (error) {
            next(error);
        }
    }

    async getFilters(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        // Endpoint /browse/filters a fost eliminat din API public.
        // Metoda este păstrată doar ca fallback pentru compatibilitate internă (dacă va fi nevoie).
        return next();
    }
}

export const browseController = new BrowseController();
