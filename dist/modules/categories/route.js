"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const express_1 = require("express");
const client_1 = __importDefault(require("../../shared/prisma/client"));
const response_1 = require("../../shared/api/http/response");
const errors_1 = require("../../shared/http/errors");
const auth_1 = require("../../middlewares/auth");
class CategoriesController {
    async list(req, res, next) {
        try {
            const categories = await client_1.default.category.findMany();
            return (0, response_1.sendSuccess)(res, categories, 'Category list');
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { slug } = req.params;
            if (!slug)
                throw new Error('Slug is required');
            const category = await client_1.default.category.findUnique({ where: { slug } });
            if (!category)
                throw new errors_1.NotFoundError('Category not found');
            return (0, response_1.sendSuccess)(res, category, 'Category details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const { name, slug, description } = req.body;
            if (!slug)
                throw new Error('Slug is required');
            const existing = await client_1.default.category.findUnique({ where: { slug } });
            if (existing)
                throw new errors_1.ConflictError('A category with this slug already exists');
            const category = await client_1.default.category.create({
                data: { name, slug, description }
            });
            return (0, response_1.sendSuccess)(res, category, 'Category created', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { slug } = req.params;
            if (!slug)
                throw new Error('Slug is required');
            const { name, description } = req.body;
            const category = await client_1.default.category.findUnique({ where: { slug } });
            if (!category)
                throw new errors_1.NotFoundError('Category not found');
            const updated = await client_1.default.category.update({
                where: { slug },
                data: { name, description }
            });
            return (0, response_1.sendSuccess)(res, updated, 'Category updated');
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const { slug } = req.params;
            if (!slug)
                throw new Error('Slug is required');
            const category = await client_1.default.category.findUnique({ where: { slug } });
            if (!category)
                throw new errors_1.NotFoundError('Category not found');
            await client_1.default.category.delete({ where: { slug } });
            return (0, response_1.sendSuccess)(res, null, 'Category deleted');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoriesController = CategoriesController;
const controller = new CategoriesController();
const router = (0, express_1.Router)();
router.get('/', controller.list);
router.get('/:slug', controller.getOne);
// Protected routes (Admin-only would be here, but for now we use authMiddleware)
router.post('/', auth_1.authMiddleware, controller.create);
router.patch('/:slug', auth_1.authMiddleware, controller.update);
router.delete('/:slug', auth_1.authMiddleware, controller.remove);
exports.default = router;
//# sourceMappingURL=route.js.map