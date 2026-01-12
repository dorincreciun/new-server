import { Request, Response, NextFunction } from 'express';
import { browseService } from './service';
import { sendSuccess } from '../../shared/api/http/response';
import { components } from '../../docs/schema';

type ProductResponse = components["schemas"]["ProductWithRelations"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export class BrowseController {
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { products, pagination } = await browseService.getProducts(req.query as any);
      return sendSuccess<ProductResponse[], PaginationMeta>(res, products, 'Products found', 200, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getFilters(
    req: Request,
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

  async getSuggestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { q, limit } = req.query as any;
      const suggestions = await browseService.getSuggestions(q, Number(limit));
      return sendSuccess(res, suggestions, 'Suggestions found');
    } catch (error) {
      next(error);
    }
  }
}

export const browseController = new BrowseController();
