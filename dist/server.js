"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
exports.ensureSchemaCompatibility = ensureSchemaCompatibility;
exports.startServer = startServer;
const app_1 = require("./app");
Object.defineProperty(exports, "createApp", { enumerable: true, get: function () { return app_1.createApp; } });
const config_1 = require("./config");
const client_1 = __importDefault(require("./shared/prisma/client"));
async function ensureSchemaCompatibility() {
    try {
        // Test connection to database
        await client_1.default.$queryRaw `SELECT 1`;
        console.log('✅ Database connection successful');
    }
    catch (err) {
        console.error('❌ Database connection failed:', err);
        throw err;
    }
}
async function startServer() {
    try {
        await ensureSchemaCompatibility();
        const app = (0, app_1.createApp)();
        const port = config_1.config.port || 3000;
        const server = app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📄 Documentation available on http://localhost:${port}/api/docs`);
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                client_1.default.$disconnect().then(() => {
                    console.log('Database connection closed');
                    process.exit(0);
                });
            });
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                client_1.default.$disconnect().then(() => {
                    console.log('Database connection closed');
                    process.exit(0);
                });
            });
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        await client_1.default.$disconnect();
        process.exit(1);
    }
}
//# sourceMappingURL=server.js.map