import { createApp } from './app';
export { createApp };
import { config } from './config';
import prisma from './shared/prisma/client';

export async function ensureSchemaCompatibility(): Promise<void> {
  try {
    // Test connection to database
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err;
  }
}

export async function startServer() {
  try {
    await ensureSchemaCompatibility();
    
    const app = createApp();
    const port = config.port || 3000;

    const server = app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📄 Documentation available on http://localhost:${port}/api/docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        prisma.$disconnect().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        prisma.$disconnect().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}


