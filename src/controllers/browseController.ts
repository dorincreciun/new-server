import { Request, Response } from 'express';
import { BrowseService } from '../services/browseService';
import { BrowseQuerySchema } from '../types/browse';
import { ok } from '../utils/response';

const browseService = new BrowseService();

export class BrowseController {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      // Validează query parameters
      const queryResult = BrowseQuerySchema.safeParse(req.query);
      
      if (!queryResult.success) {
        res.status(422).json({
          error: 'Parametri invalizi',
          details: queryResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }

      const DEFAULT_LIMIT = 20;
      const query = { ...queryResult.data, limit: DEFAULT_LIMIT } as any;
      const { products, total } = await browseService.getProducts(query);

      const totalPages = Math.ceil(total / DEFAULT_LIMIT);

      const response: BrowseResponse = {
        message: 'Produsele au fost filtrate cu succes',
        data: products,
        pagination: {
          page: query.page,
          limit: DEFAULT_LIMIT,
          total,
          totalPages
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Eroare la filtrarea produselor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului'
      });
    }
  }

  async getFilters(req: Request, res: Response): Promise<void> {
    try {
      const queryResult = BrowseQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(422).json({
          error: 'Parametri invalizi',
          details: queryResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }

      const query = queryResult.data;
      const filters = await browseService.getFilters(query);

      res.status(200).json({
        message: 'Opțiunile de filtrare',
        data: filters
      });
    } catch (error) {
      console.error('Eroare la obținerea filtrelor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului'
      });
    }
  }
}
