import express, { Request, Response } from 'express';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'node:fs';
import { config } from './config';

export function createApp() {
  const app = express();
  app.use(express.json());
  // Servește fișiere statice din public (pentru scriptul custom și alte resurse)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Health route
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Swagger specification via swagger-jsdoc (basic empty spec scaffold)
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: config.swaggerTitle,
        version: config.swaggerVersion,
      },
      servers: config.swaggerServerUrl
        ? [{ url: config.swaggerServerUrl }]
        : [{ url: `http://localhost:${config.port}` }],
    },
    apis: [],
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


