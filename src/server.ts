import express, { Request, Response } from 'express';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import { authRoutes } from './routes/authRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { productRoutes } from './routes/productRoutes';
import { taxonomyRoutes } from './routes/taxonomyRoutes';

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
  app.use('/api/taxonomies', taxonomyRoutes); // TODO: protejează cu RBAC (admin/moderator)

  // Swagger specification via swagger-jsdoc
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: config.swaggerTitle,
        version: config.swaggerVersion,
        description: 'API pentru sistemul de autorizare cu JWT și gestionarea categoriilor și produselor',
      },
      servers: config.swaggerServerUrl
        ? [{ url: config.swaggerServerUrl }]
        : [{ url: `http://localhost:${config.port}` }],
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

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customJs: '/swagger-custom.js',
    customCssUrl: '/swagger-custom.css',
  }));

  // Servește fișierul YAML public și setează content-type corect
  app.get('/openapi.yaml', (_req, res) => {
    const filePath = path.join(process.cwd(), 'public', 'openapi.yaml');
    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
    res.send(fs.readFileSync(filePath, 'utf8'));
  });

  return app;
}


