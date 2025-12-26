import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
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
  app.get('/api/docs/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'openapi.yaml'));
  });
  app.get('/api/docs/schema.d.ts', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'schema.d.ts'));
  });

  // Swagger Documentation
  const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
  const swaggerDocument = yaml.load(openapiPath);
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

  // Error handling
  app.use(errorHandler);

  return app;
}
