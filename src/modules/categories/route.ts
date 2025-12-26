import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../../shared/prisma/client';
import { sendSuccess } from '../../shared/api/http/response';
import { NotFoundError, ConflictError } from '../../shared/http/errors';
import { authMiddleware } from '../../middlewares/auth';
import { components } from '../../docs/schema';

type CategoryResponse = components["schemas"]["Category"];

export class CategoriesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany();
      return sendSuccess<CategoryResponse[]>(res, categories, 'Category list');
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug) throw new Error('Slug is required');

      const category = await prisma.category.findUnique({ where: { slug } });
      if (!category) throw new NotFoundError('Category not found');
      return sendSuccess<CategoryResponse>(res, category, 'Category details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug, description } = req.body;
      if (!slug) throw new Error('Slug is required');
      
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) throw new ConflictError('A category with this slug already exists');

      const category = await prisma.category.create({
        data: { name, slug, description }
      });
      return sendSuccess<CategoryResponse>(res, category, 'Category created', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug) throw new Error('Slug is required');

      const { name, description } = req.body;

      const category = await prisma.category.findUnique({ where: { slug } });
      if (!category) throw new NotFoundError('Category not found');

      const updated = await prisma.category.update({
        where: { slug },
        data: { name, description }
      });
      return sendSuccess<CategoryResponse>(res, updated, 'Category updated');
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug) throw new Error('Slug is required');

      const category = await prisma.category.findUnique({ where: { slug } });
      if (!category) throw new NotFoundError('Category not found');

      await prisma.category.delete({ where: { slug } });
      return sendSuccess(res, null, 'Category deleted');
    } catch (error) {
      next(error);
    }
  }
}

const controller = new CategoriesController();
const router = Router();

router.get('/', controller.list);
router.get('/:slug', controller.getOne);

// Protected routes (Admin-only would be here, but for now we use authMiddleware)
router.post('/', authMiddleware, controller.create);
router.patch('/:slug', authMiddleware, controller.update);
router.delete('/:slug', authMiddleware, controller.remove);

export default router;
