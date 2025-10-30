import swaggerJSDoc from 'swagger-jsdoc';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../src/config';

// Configurarea Swagger identică cu cea din server.ts
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: config.swaggerTitle,
      version: config.swaggerVersion,
      description: 'API public. Autentificare prin cookie HTTP-Only; clientul trebuie să folosească credentials: \'include\'.',
    },
    servers: config.swaggerServerUrl
      ? [{ url: config.swaggerServerUrl }]
      : [{ url: `http://localhost:${config.port}` }],
    components: {}, 
  },
  apis: ['./src/routes/*.ts'],
});

// Convertește JSON în YAML
const yamlContent = yaml.dump(swaggerSpec, {
  indent: 2,
  lineWidth: -1,
  noRefs: true,
});

// Scrie în public/openapi.yaml
const outputPath = path.join(process.cwd(), 'public', 'openapi.yaml');
fs.writeFileSync(outputPath, yamlContent, 'utf8');

console.log(`✅ OpenAPI YAML generat: ${outputPath}`);
console.log(`📊 Endpoint-uri găsite: ${Object.keys((swaggerSpec as any).paths || {}).length}`);
