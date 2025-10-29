"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseController = void 0;
const browseService_1 = require("../services/browseService");
const browse_1 = require("../types/browse");
const browseService = new browseService_1.BrowseService();
class BrowseController {
    async getProducts(req, res) {
        try {
            // Validează query parameters
            const queryResult = browse_1.BrowseQuerySchema.safeParse(req.query);
            if (!queryResult.success) {
                res.status(422).json({
                    error: 'Parametri invalizi',
                    details: queryResult.error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
                return;
            }
            const DEFAULT_LIMIT = 20;
            const query = { ...queryResult.data, limit: DEFAULT_LIMIT };
            const { products, total } = await browseService.getProducts(query);
            const totalPages = Math.ceil(total / DEFAULT_LIMIT);
            const response = {
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
        }
        catch (error) {
            console.error('Eroare la filtrarea produselor:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului'
            });
        }
    }
    async getFilters(req, res) {
        try {
            const queryResult = browse_1.BrowseQuerySchema.safeParse(req.query);
            if (!queryResult.success) {
                res.status(422).json({
                    error: 'Parametri invalizi',
                    details: queryResult.error.issues.map((err) => ({
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
        }
        catch (error) {
            console.error('Eroare la obținerea filtrelor:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului'
            });
        }
    }
}
exports.BrowseController = BrowseController;
//# sourceMappingURL=browseController.js.map