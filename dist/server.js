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
        const result = await client_1.default.$queryRawUnsafe('SELECT DATABASE() AS db');
        const db = result[0]?.db;
        if (!db)
            return;
    }
    catch (err) {
        console.error('Schema compatibility check failed:', err);
    }
    finally {
        await client_1.default.$disconnect();
    }
}
async function startServer() {
    await ensureSchemaCompatibility();
    const app = (0, app_1.createApp)();
    const port = config_1.config.port || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📄 Documentation available on http://localhost:${port}/api/docs`);
    });
}
//# sourceMappingURL=server.js.map