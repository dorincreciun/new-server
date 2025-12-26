import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../../shared/prisma/client';
import { sendSuccess } from '../../shared/api/http/response';
import { NotFoundError } from '../../shared/http/errors';
import { authMiddleware } from '../../middlewares/auth';
import { formatProduct } from '../../shared/utils/formatters';
import { components } from '../../docs/schema';

type ProductResponse = components["schemas"]["ProductWithRelations"];

export class ProductsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          flags: { include: { flag: true } },
          ingredients: { include: { ingredient: true } },
          variants: { include: { dough: true, size: true } },
        }
      });
      const formatted = products.map(formatProduct);
      return sendSuccess<ProductResponse[]>(res, formatted, 'Product list');
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          flags: { include: { flag: true } },
          ingredients: { include: { ingredient: true } },
          variants: { include: { dough: true, size: true } },
        }
      });
      if (!product) throw new NotFoundError('Product not found');
      
      const formatted = formatProduct(product);
      
      return sendSuccess<ProductResponse>(res, formatted, 'Product details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, categoryId, basePrice, description } = req.body;
      const product = await prisma.product.create({
        data: { name, categoryId, basePrice, description }
      });
      return sendSuccess(res, product, 'Product created', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundError('Product not found');

      const updated = await prisma.product.update({
        where: { id },
        data: req.body
      });
      return sendSuccess(res, updated, 'Product updated');
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundError('Product not found');

      await prisma.product.delete({ where: { id } });
      return sendSuccess(res, null, 'Product deleted');
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ProductsController();
const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.post('/', authMiddleware, controller.create);
router.patch('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.remove);

export default router;
