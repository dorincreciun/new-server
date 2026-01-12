import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import yaml from 'yamljs';
import { config } from './config';
import { errorHandler } from './middlewares/error-handler';

// Import module routes
import authRoutes from './modules/auth/route';
import cartRoutes from './modules/cart/route';
import browseRoutes from './modules/browse/route';
import productRoutes from './modules/products/route';
import categoryRoutes from './modules/categories/route';
import taxonomyRoutes from './modules/taxonomies/route';
import orderRoutes from './modules/orders/route';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(cors({
    origin: config.clientOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }));

  app.use(express.json());
  app.use(cookieParser());

  // Serve static documentation files (openapi.yaml, schema.d.ts)
  // Use process.cwd() for both dev and production
  const docsPath = path.join(process.cwd(), 'dist', 'docs');
  const srcDocsPath = path.join(process.cwd(), 'src', 'docs');
  
  // Try dist first (production), then src (development)
  const openapiPath = path.join(docsPath, 'openapi.yaml');
  const openapiPathDev = path.join(srcDocsPath, 'openapi.yaml');
  
  app.get('/api/docs/openapi.yaml', (req, res) => {
    const filePath = fs.existsSync(openapiPath) ? openapiPath : openapiPathDev;
    res.sendFile(filePath);
  });
  
  app.get('/api/docs/schema.d.ts', (req, res) => {
    const schemaPath = path.join(docsPath, 'schema.d.ts');
    const schemaPathDev = path.join(srcDocsPath, 'schema.d.ts');
    const filePath = fs.existsSync(schemaPath) ? schemaPath : schemaPathDev;
    res.sendFile(filePath);
  });

  // Swagger Documentation
  const swaggerDocPath = fs.existsSync(openapiPath) ? openapiPath : openapiPathDev;
  const swaggerDocument = yaml.load(swaggerDocPath);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/browse', browseRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/taxonomies', taxonomyRoutes);
  app.use('/api', orderRoutes); // Checkout și Orders sunt la rădăcină conform OpenAPI

  // Error handling
  app.use(errorHandler);

  return app;
}
