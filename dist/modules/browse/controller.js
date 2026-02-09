"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseController = exports.BrowseController = void 0;
const service_1 = require("./service");
const response_1 = require("../../shared/http/response");
class BrowseController {
    async getProducts(req, res, next) {
        try {
            const { products, pagination, filters } = await service_1.browseService.getProducts(req.query);
            return (0, response_1.sendSuccess)(res, products, 'Products found', 200, { pagination, filters });
        }
        catch (error) {
            next(error);
        }
    }
    async searchProducts(req, res, next) {
        try {
            const { products, pagination } = await service_1.browseService.searchProducts(req.query);
            return (0, response_1.sendSuccess)(res, products, 'Products found by search', 200, { pagination });
        }
        catch (error) {
            next(error);
        }
    }
    async getFilters(req, res, next) {
        // Endpoint /browse/filters a fost eliminat din API public.
        // Metoda este păstrată doar ca fallback pentru compatibilitate internă (dacă va fi nevoie).
        return next();
    }
}
exports.BrowseController = BrowseController;
exports.browseController = new BrowseController();
//# sourceMappingURL=controller.js.map