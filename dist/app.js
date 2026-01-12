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
const fs_1 = __importDefault(require("fs"));
const yamljs_1 = __importDefault(require("yamljs"));
const config_1 = require("./config");
const error_handler_1 = require("./middlewares/error-handler");
// Import module routes
const route_1 = __importDefault(require("./modules/auth/route"));
const route_2 = __importDefault(require("./modules/cart/route"));
const route_3 = __importDefault(require("./modules/browse/route"));
const route_4 = __importDefault(require("./modules/products/route"));
const route_5 = __importDefault(require("./modules/categories/route"));
const route_6 = __importDefault(require("./modules/taxonomies/route"));
const route_7 = __importDefault(require("./modules/orders/route"));
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
    // Use process.cwd() for both dev and production
    const docsPath = path_1.default.join(process.cwd(), 'dist', 'docs');
    const srcDocsPath = path_1.default.join(process.cwd(), 'src', 'docs');
    // Try dist first (production), then src (development)
    const openapiPath = path_1.default.join(docsPath, 'openapi.yaml');
    const openapiPathDev = path_1.default.join(srcDocsPath, 'openapi.yaml');
    app.get('/api/docs/openapi.yaml', (req, res) => {
        const filePath = fs_1.default.existsSync(openapiPath) ? openapiPath : openapiPathDev;
        res.sendFile(filePath);
    });
    app.get('/api/docs/schema.d.ts', (req, res) => {
        const schemaPath = path_1.default.join(docsPath, 'schema.d.ts');
        const schemaPathDev = path_1.default.join(srcDocsPath, 'schema.d.ts');
        const filePath = fs_1.default.existsSync(schemaPath) ? schemaPath : schemaPathDev;
        res.sendFile(filePath);
    });
    // Swagger Documentation
    const swaggerDocPath = fs_1.default.existsSync(openapiPath) ? openapiPath : openapiPathDev;
    const swaggerDocument = yamljs_1.default.load(swaggerDocPath);
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
    app.use('/api', route_7.default); // Checkout și Orders sunt la rădăcină conform OpenAPI
    // Error handling
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map