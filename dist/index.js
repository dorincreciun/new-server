"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const config_1 = require("./config");
(async () => {
    await (0, server_1.ensureSchemaCompatibility)();
    const app = (0, server_1.createApp)();
    app.listen(config_1.config.port, () => {
        console.log(`Server listening on port ${config_1.config.port}`);
    });
})();
//# sourceMappingURL=index.js.map