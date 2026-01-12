import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Script pentru actualizarea completă a documentației:
 * 1. Copiază openapi.yaml în dist/docs
 * 2. Regenerează schema.d.ts din openapi.yaml
 * 3. Copiază schema.d.ts în dist/docs
 */

const rootDir = process.cwd();
const srcDocsDir = path.join(rootDir, 'src', 'docs');
const distDocsDir = path.join(rootDir, 'dist', 'docs');

console.log('📚 Actualizare documentație...\n');

// 1. Asigură-te că dist/docs există
if (!fs.existsSync(distDocsDir)) {
  fs.mkdirSync(distDocsDir, { recursive: true });
  console.log('✅ Creat director dist/docs');
}

// 2. Copiază openapi.yaml în dist/docs
const openapiSrc = path.join(srcDocsDir, 'openapi.yaml');
const openapiDist = path.join(distDocsDir, 'openapi.yaml');

if (fs.existsSync(openapiSrc)) {
  fs.copyFileSync(openapiSrc, openapiDist);
  console.log('✅ Copiat openapi.yaml în dist/docs');
} else {
  console.error('❌ Nu s-a găsit src/docs/openapi.yaml');
  process.exit(1);
}

// 3. Regenerează schema.d.ts din openapi.yaml
console.log('\n🔄 Regenerare schema TypeScript...');
try {
  execSync('npm run generate:types', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Schema TypeScript regenerată');
} catch (error) {
  console.error('❌ Eroare la regenerarea schema:', error);
  process.exit(1);
}

// 4. Copiază schema.d.ts în dist/docs
const schemaSrc = path.join(srcDocsDir, 'schema.d.ts');
const schemaDist = path.join(distDocsDir, 'schema.d.ts');

if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, schemaDist);
  console.log('✅ Copiat schema.d.ts în dist/docs');
} else {
  console.warn('⚠️  Nu s-a găsit src/docs/schema.d.ts');
}

console.log('\n✨ Documentația a fost actualizată cu succes!');
console.log('📄 Swagger UI: http://localhost:3000/api/docs');
console.log('📥 OpenAPI Spec: http://localhost:3000/api/docs/openapi.yaml');
console.log('📥 TypeScript Schema: http://localhost:3000/api/docs/schema.d.ts');

