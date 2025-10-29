"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("../src/config");
// Configurarea Swagger identică cu cea din server.ts
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.3',
        info: {
            title: config_1.config.swaggerTitle,
            version: config_1.config.swaggerVersion,
            description: 'API pentru sistemul de autorizare cu JWT',
        },
        servers: config_1.config.swaggerServerUrl
            ? [{ url: config_1.config.swaggerServerUrl }]
            : [{ url: `http://localhost:${config_1.config.port}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
});
// Convertește JSON în YAML
const yamlContent = js_yaml_1.default.dump(swaggerSpec, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
});
// Scrie în public/openapi.yaml
const outputPath = node_path_1.default.join(process.cwd(), 'public', 'openapi.yaml');
node_fs_1.default.writeFileSync(outputPath, yamlContent, 'utf8');
console.log(`✅ OpenAPI YAML generat: ${outputPath}`);
console.log(`📊 Endpoint-uri găsite: ${Object.keys(swaggerSpec.paths || {}).length}`);
//# sourceMappingURL=generate-openapi.js.map