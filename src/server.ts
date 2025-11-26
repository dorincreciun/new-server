import express, { Request, Response, NextFunction } from 'express';
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
import { cartRoutes } from './routes/cart';
import { PrismaClient } from '@prisma/client';

// La pornire, ne asigurăm că tabela Product are coloanele necesare (basePrice, minPrice, maxPrice)
export async function ensureSchemaCompatibility(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    // Determină baza de date curentă
    const result = await prisma.$queryRawUnsafe(
      'SELECT DATABASE() AS db'
    ) as Array<{ db: string }>;
    const db = result[0]?.db;
    if (!db) {
      throw new Error('Could not determine database name');
    }

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

    // Helper pentru a verifica existența unui index
    async function indexExists(table: string, indexName: string): Promise<boolean> {
      const rows: Array<{ cnt: bigint | number }> = await prisma.$queryRawUnsafe(
        `SELECT COUNT(1) AS cnt FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
        db,
        table,
        indexName
      );
      const cnt = Number((rows[0]?.cnt ?? 0) as any);
      return cnt > 0;
    }

    // Dacă lipsește basePrice, îl adăugăm și migrăm valoarea din coloana veche `price` dacă există
    if (!hasBase) {
      const hasOldPrice = await columnExists('Product', 'price');
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Product ADD COLUMN basePrice DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER description`
      );
      if (hasOldPrice) {
        await prisma.$executeRawUnsafe(`UPDATE Product SET basePrice = price WHERE price IS NOT NULL`);
      }
      // Index opțional pentru sortare după preț
      const hasBaseIdx = await indexExists('Product', 'idx_product_basePrice');
      if (!hasBaseIdx) {
        await prisma.$executeRawUnsafe(`CREATE INDEX idx_product_basePrice ON Product (basePrice)`);
      }
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

  // Servește fișierul OpenAPI YAML generat în public/openapi.yaml (sursă unică)
  const serveOpenApi = (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'public', 'openapi.yaml');
    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
    try {
      res.send(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      res.status(404).send('# OpenAPI yaml inexistent. Rulați: npm run generate:openapi');
    }
  };
  app.get('/api/openapi.yaml', serveOpenApi);
  app.get('/openapi.yaml', serveOpenApi);

  // Servește fișiere statice din public (pentru scriptul custom și alte resurse)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Health route (compatibilitate cu /health și /api/health)
  const healthHandler = (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  };
  app.get('/api/health', healthHandler);
  app.get('/health', healthHandler);

  // API routes (prefix /api)
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/browse', browseRoutes);
  app.use('/api/taxonomies', taxonomyRoutes); // TODO: protejează cu RBAC (admin/moderator)
  app.use('/api/cart', cartRoutes);

  // Compatibilitate: expune și fără prefix /api pentru clienții vechi și pentru descrierile Swagger existente
  app.use('/auth', authRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/products', productRoutes);
  app.use('/browse', browseRoutes);
  app.use('/taxonomies', taxonomyRoutes);
  app.use('/cart', cartRoutes);

  // Swagger UI serving the clean OpenAPI YAML sub /api și /docs clasic
  const swaggerMiddleware = swaggerUi.setup(undefined, {
    swaggerUrl: '/api/openapi.yaml',
    explorer: true,
    customJs: '/swagger-custom.js',
    customCssUrl: '/swagger-custom.css',
  });
  app.use('/api/docs', swaggerUi.serve, swaggerMiddleware);
  app.use('/docs', swaggerUi.serve, swaggerMiddleware);

  // 404 handler for unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Centralized error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = err?.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  return app;
}


