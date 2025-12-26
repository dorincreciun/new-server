import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../../shared/prisma/client';
import { sendSuccess } from '../../shared/api/http/response';

export class TaxonomiesController {
  async getIngredients(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.ingredient.findMany();
      return sendSuccess(res, data, 'Ingredient list');
    } catch (error) {
      next(error);
    }
  }

  async getFlags(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.flag.findMany();
      return sendSuccess(res, data, 'Flag list');
    } catch (error) {
      next(error);
    }
  }

  async getDoughTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.doughType.findMany();
      return sendSuccess(res, data, 'Dough type list');
    } catch (error) {
      next(error);
    }
  }

  async getSizeOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.sizeOption.findMany();
      return sendSuccess(res, data, 'Size list');
    } catch (error) {
      next(error);
    }
  }
}

const controller = new TaxonomiesController();
const router = Router();

router.get('/ingredients', controller.getIngredients);
router.get('/flags', controller.getFlags);
router.get('/dough-types', controller.getDoughTypes);
router.get('/size-options', controller.getSizeOptions);

export default router;
