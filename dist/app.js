"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const yamljs_1 = __importDefault(require("yamljs"));
const config_1 = require("./config");
const errorHandler_1 = require("./shared/middleware/errorHandler");
// Import module routes
const route_1 = __importDefault(require("./modules/auth/route"));
const route_2 = __importDefault(require("./modules/cart/route"));
const route_3 = __importDefault(require("./modules/browse/route"));
const route_4 = __importDefault(require("./modules/products/route"));
const route_5 = __importDefault(require("./modules/categories/route"));
const route_6 = __importDefault(require("./modules/taxonomies/route"));
function createApp() {
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use((0, cors_1.default)({
        origin: config_1.config.clientOrigin,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // Serve static documentation files (openapi.yaml, schema.d.ts)
    app.get('/api/docs/openapi.yaml', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'docs', 'openapi.yaml'));
    });
    app.get('/api/docs/schema.d.ts', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'docs', 'schema.d.ts'));
    });
    // Swagger Documentation
    const openapiPath = path_1.default.join(__dirname, 'docs', 'openapi.yaml');
    const swaggerDocument = yamljs_1.default.load(openapiPath);
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    // Health check
    app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
    // API Routes
    app.use('/api/auth', route_1.default);
    app.use('/api/cart', route_2.default);
    app.use('/api/browse', route_3.default);
    app.use('/api/products', route_4.default);
    app.use('/api/categories', route_5.default);
    app.use('/api/taxonomies', route_6.default);
    // Error handling
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map