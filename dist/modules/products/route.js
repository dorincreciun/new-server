"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const express_1 = require("express");
const client_1 = __importDefault(require("../../shared/prisma/client"));
const response_1 = require("../../shared/api/http/response");
const errors_1 = require("../../shared/http/errors");
const auth_1 = require("../../middlewares/auth");
const formatters_1 = require("../../shared/utils/formatters");
class ProductsController {
    async list(req, res, next) {
        try {
            const products = await client_1.default.product.findMany({
                include: {
                    category: true,
                    flags: { include: { flag: true } },
                    ingredients: { include: { ingredient: true } },
                    variants: { include: { dough: true, size: true } },
                }
            });
            const formatted = products.map(formatters_1.formatProduct);
            return (0, response_1.sendSuccess)(res, formatted, 'Product list');
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const id = Number(req.params.id);
            const product = await client_1.default.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    flags: { include: { flag: true } },
                    ingredients: { include: { ingredient: true } },
                    variants: { include: { dough: true, size: true } },
                }
            });
            if (!product)
                throw new errors_1.NotFoundError('Product not found');
            const formatted = (0, formatters_1.formatProduct)(product);
            return (0, response_1.sendSuccess)(res, formatted, 'Product details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const { name, categoryId, basePrice, description } = req.body;
            const product = await client_1.default.product.create({
                data: { name, categoryId, basePrice, description }
            });
            return (0, response_1.sendSuccess)(res, product, 'Product created', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const product = await client_1.default.product.findUnique({ where: { id } });
            if (!product)
                throw new errors_1.NotFoundError('Product not found');
            const updated = await client_1.default.product.update({
                where: { id },
                data: req.body
            });
            return (0, response_1.sendSuccess)(res, updated, 'Product updated');
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            const product = await client_1.default.product.findUnique({ where: { id } });
            if (!product)
                throw new errors_1.NotFoundError('Product not found');
            await client_1.default.product.delete({ where: { id } });
            return (0, response_1.sendSuccess)(res, null, 'Product deleted');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductsController = ProductsController;
const controller = new ProductsController();
const router = (0, express_1.Router)();
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', auth_1.authMiddleware, controller.create);
router.patch('/:id', auth_1.authMiddleware, controller.update);
router.delete('/:id', auth_1.authMiddleware, controller.remove);
exports.default = router;
//# sourceMappingURL=route.js.map