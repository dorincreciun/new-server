import { Request, Response, NextFunction } from 'express';
import { browseService } from './service';
import { sendSuccess } from '../../shared/http/response';
import { paths } from '../../docs/schema';

export class BrowseController {
  async getProducts(
    req: Request<any, any, any, paths['/browse/products']['get']['parameters']['query']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { products, pagination } = await browseService.getProducts(req.query as any);
      return sendSuccess(res, products, 'Products found', 200, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getFilters(
    req: Request<any, any, any, paths['/browse/filters']['get']['parameters']['query']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filters = await browseService.getFilters(req.query as any);
      return sendSuccess(res, filters, 'Available filters');
    } catch (error) {
      next(error);
    }
  }
}

export const browseController = new BrowseController();
