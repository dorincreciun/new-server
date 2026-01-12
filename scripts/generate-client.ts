import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Script pentru generarea clientului TypeScript din OpenAPI spec.
 * Poate fi folosit pentru a genera clientul pentru frontend sau alte servicii.
 * 
 * Usage:
 *   npm run generate:client
 *   npm run generate:client -- --output ./client-types
 */

const rootDir = process.cwd();
const openapiPath = path.join(rootDir, 'src', 'docs', 'openapi.yaml');
const outputArg = process.argv.find(arg => arg.startsWith('--output='));
const outputDir = outputArg 
  ? outputArg.split('=')[1] 
  : path.join(rootDir, 'generated', 'client');

console.log('🔧 Generare client TypeScript din OpenAPI...\n');

if (!fs.existsSync(openapiPath)) {
  console.error(`❌ Nu s-a găsit ${openapiPath}`);
  process.exit(1);
}

// Creează directorul de output dacă nu există
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Creat director ${outputDir}`);
}

const outputFile = path.join(outputDir, 'api-client.d.ts');

try {
  console.log(`📄 Generare din: ${openapiPath}`);
  console.log(`📦 Output: ${outputFile}\n`);
  
  execSync(
    `npx openapi-typescript "${openapiPath}" -o "${outputFile}"`,
    { stdio: 'inherit', cwd: rootDir }
  );
  
  console.log(`\n✅ Client TypeScript generat cu succes în ${outputFile}`);
  console.log(`\n💡 Pentru a folosi clientul:`);
  console.log(`   import type { components, paths } from './generated/client/api-client';`);
  
} catch (error) {
  console.error('❌ Eroare la generarea clientului:', error);
  process.exit(1);
}

