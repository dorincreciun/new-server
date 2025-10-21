import express, { Request, Response } from 'express';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import { authRoutes } from './routes/authRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { productRoutes } from './routes/productRoutes';
import { browseRoutes } from './routes/browse';
import { taxonomyRoutes } from './routes/taxonomyRoutes';
import { PrismaClient } from '@prisma/client';

// La pornire, ne asigurăm că tabela Product are coloanele necesare (basePrice, minPrice, maxPrice)
export async function ensureSchemaCompatibility(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    // Determină baza de date curentă
    const [{ db }]: Array<{ db: string }> = await prisma.$queryRawUnsafe(
      'SELECT DATABASE() AS db'
    );

    // Helper pentru a verifica existența unei coloane
    async function columnExists(table: string, column: string): Promise<boolean> {
      const rows: Array<{ cnt: bigint | number }> = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        db,
        table,
        column
      );
      const cnt = Number((rows[0]?.cnt ?? 0) as any);
      return cnt > 0;
    }

    const hasBase = await columnExists('Product', 'basePrice');
    const hasMin = await columnExists('Product', 'minPrice');
    const hasMax = await columnExists('Product', 'maxPrice');

    // Dacă lipsește basePrice, îl adăugăm și migrăm valoarea din coloana veche `price` dacă există
    if (!hasBase) {
      const hasOldPrice = await columnExists('Product', 'price');
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Product ADD COLUMN basePrice DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER description`
      );
      if (hasOldPrice) {
        await prisma.$executeRawUnsafe(`UPDATE Product SET basePrice = price WHERE price IS NOT NULL`);
      }
      // Index optional pentru sortare după preț
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_product_basePrice ON Product (basePrice)`);
    }

    if (!hasMin) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Product ADD COLUMN minPrice DECIMAL(10,2) NULL AFTER basePrice`
      );
    }

    if (!hasMax) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Product ADD COLUMN maxPrice DECIMAL(10,2) NULL AFTER minPrice`
      );
    }
  } catch (err) {
    // Nu întrerupem pornirea serverului dacă nu putem ajusta schema, doar logăm clar eroarea
    console.error('Schema compatibility check failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

export function createApp() {
  const app = express();
  
  // Trust proxy pentru producție
  app.set('trust proxy', 1);
  
  // CORS cu credentials
  app.use(cors({
    origin: config.clientOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }));
  
  app.use(express.json());
  app.use(cookieParser());
  
  // Servește fișiere statice din public (pentru scriptul custom și alte resurse)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Health route
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/browse', browseRoutes);
  app.use('/api/taxonomies', taxonomyRoutes); // TODO: protejează cu RBAC (admin/moderator)

  // Also expose routes at paths used in OpenAPI (no /api prefix)
  app.use('/auth', authRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/products', productRoutes);
  app.use('/browse', browseRoutes);
  app.use('/taxonomies', taxonomyRoutes);

  // Swagger UI serving the clean OpenAPI YAML
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerUrl: '/openapi.yaml',
    explorer: true,
    customJs: '/swagger-custom.js',
    customCssUrl: '/swagger-custom.css',
  }));

  // Servește fișierul YAML public și setează content-type corect
  app.get('/openapi.yaml', (_req, res) => {
    const filePath = path.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
    res.send(fs.readFileSync(filePath, 'utf8'));
  });

  return app;
}


