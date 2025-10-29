"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSchemaCompatibility = ensureSchemaCompatibility;
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const node_fs_1 = __importDefault(require("node:fs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const authRoutes_1 = require("./routes/authRoutes");
const categoryRoutes_1 = require("./routes/categoryRoutes");
const productRoutes_1 = require("./routes/productRoutes");
const browse_1 = require("./routes/browse");
const taxonomyRoutes_1 = require("./routes/taxonomyRoutes");
const cart_1 = require("./routes/cart");
const client_1 = require("@prisma/client");
// La pornire, ne asigurăm că tabela Product are coloanele necesare (basePrice, minPrice, maxPrice)
async function ensureSchemaCompatibility() {
    const prisma = new client_1.PrismaClient();
    try {
        // Determină baza de date curentă
        const result = await prisma.$queryRawUnsafe('SELECT DATABASE() AS db');
        const db = result[0]?.db;
        if (!db) {
            throw new Error('Could not determine database name');
        }
        // Helper pentru a verifica existența unei coloane
        async function columnExists(table, column) {
            const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`, db, table, column);
            const cnt = Number((rows[0]?.cnt ?? 0));
            return cnt > 0;
        }
        const hasBase = await columnExists('Product', 'basePrice');
        const hasMin = await columnExists('Product', 'minPrice');
        const hasMax = await columnExists('Product', 'maxPrice');
        // Dacă lipsește basePrice, îl adăugăm și migrăm valoarea din coloana veche `price` dacă există
        if (!hasBase) {
            const hasOldPrice = await columnExists('Product', 'price');
            await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN basePrice DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER description`);
            if (hasOldPrice) {
                await prisma.$executeRawUnsafe(`UPDATE Product SET basePrice = price WHERE price IS NOT NULL`);
            }
            // Index optional pentru sortare după preț
            await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_product_basePrice ON Product (basePrice)`);
        }
        if (!hasMin) {
            await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN minPrice DECIMAL(10,2) NULL AFTER basePrice`);
        }
        if (!hasMax) {
            await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN maxPrice DECIMAL(10,2) NULL AFTER minPrice`);
        }
    }
    catch (err) {
        // Nu întrerupem pornirea serverului dacă nu putem ajusta schema, doar logăm clar eroarea
        console.error('Schema compatibility check failed:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
function createApp() {
    const app = (0, express_1.default)();
    // Trust proxy pentru producție
    app.set('trust proxy', 1);
    // CORS cu credentials
    app.use((0, cors_1.default)({
        origin: config_1.config.clientOrigin,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // Servește fișierul OpenAPI YAML din sursă (prioritar față de static)
    app.get('/openapi.yaml', (_req, res) => {
        const filePath = node_path_1.default.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
        res.setHeader('Content-Type', 'text/yaml');
        res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
        res.send(node_fs_1.default.readFileSync(filePath, 'utf8'));
    });
    // Servește fișiere statice din public (pentru scriptul custom și alte resurse)
    app.use(express_1.default.static(node_path_1.default.join(process.cwd(), 'public')));
    // Health route
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    // API routes
    app.use('/api/auth', authRoutes_1.authRoutes);
    app.use('/api/categories', categoryRoutes_1.categoryRoutes);
    app.use('/api/products', productRoutes_1.productRoutes);
    app.use('/api/browse', browse_1.browseRoutes);
    app.use('/api/taxonomies', taxonomyRoutes_1.taxonomyRoutes); // TODO: protejează cu RBAC (admin/moderator)
    app.use('/api/cart', cart_1.cartRoutes);
    // Also expose routes at paths used in OpenAPI (no /api prefix)
    app.use('/auth', authRoutes_1.authRoutes);
    app.use('/categories', categoryRoutes_1.categoryRoutes);
    app.use('/products', productRoutes_1.productRoutes);
    app.use('/browse', browse_1.browseRoutes);
    app.use('/taxonomies', taxonomyRoutes_1.taxonomyRoutes);
    app.use('/cart', cart_1.cartRoutes);
    // Swagger UI serving the clean OpenAPI YAML
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
        swaggerUrl: '/openapi.yaml',
        explorer: true,
        customJs: '/swagger-custom.js',
        customCssUrl: '/swagger-custom.css',
    }));
    return app;
}
//# sourceMappingURL=server.js.map