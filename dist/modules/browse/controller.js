"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseController = exports.BrowseController = void 0;
const service_1 = require("./service");
const response_1 = require("../../shared/api/http/response");
class BrowseController {
    async getProducts(req, res, next) {
        try {
            const { products, pagination } = await service_1.browseService.getProducts(req.query);
            return (0, response_1.sendSuccess)(res, products, 'Products found', 200, pagination);
        }
        catch (error) {
            next(error);
        }
    }
    async getFilters(req, res, next) {
        try {
            const filters = await service_1.browseService.getFilters(req.query);
            return (0, response_1.sendSuccess)(res, filters, 'Available filters');
        }
        catch (error) {
            next(error);
        }
    }
    async getSuggestions(req, res, next) {
        try {
            const { q, limit } = req.query;
            const suggestions = await service_1.browseService.getSuggestions(q, Number(limit));
            return (0, response_1.sendSuccess)(res, suggestions, 'Suggestions found');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BrowseController = BrowseController;
exports.browseController = new BrowseController();
//# sourceMappingURL=controller.js.map