"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomiesController = void 0;
const express_1 = require("express");
const client_1 = __importDefault(require("../../shared/prisma/client"));
const response_1 = require("../../shared/http/response");
class TaxonomiesController {
    async getIngredients(req, res, next) {
        try {
            const data = await client_1.default.ingredient.findMany();
            return (0, response_1.sendSuccess)(res, data, 'Ingredient list');
        }
        catch (error) {
            next(error);
        }
    }
    async getFlags(req, res, next) {
        try {
            const data = await client_1.default.flag.findMany();
            return (0, response_1.sendSuccess)(res, data, 'Flag list');
        }
        catch (error) {
            next(error);
        }
    }
    async getDoughTypes(req, res, next) {
        try {
            const data = await client_1.default.doughType.findMany();
            return (0, response_1.sendSuccess)(res, data, 'Dough type list');
        }
        catch (error) {
            next(error);
        }
    }
    async getSizeOptions(req, res, next) {
        try {
            const data = await client_1.default.sizeOption.findMany();
            return (0, response_1.sendSuccess)(res, data, 'Size list');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TaxonomiesController = TaxonomiesController;
const controller = new TaxonomiesController();
const router = (0, express_1.Router)();
router.get('/ingredients', controller.getIngredients);
router.get('/flags', controller.getFlags);
router.get('/dough-types', controller.getDoughTypes);
router.get('/size-options', controller.getSizeOptions);
exports.default = router;
//# sourceMappingURL=route.js.map