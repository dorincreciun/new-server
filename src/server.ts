import { createApp } from './app';
export { createApp };
import { config } from './config';
import prisma from './shared/prisma/client';

export async function ensureSchemaCompatibility(): Promise<void> {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT DATABASE() AS db') as any[];
    const db = result[0]?.db;
    if (!db) return;
  } catch (err) {
    console.error('Schema compatibility check failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function startServer() {
  await ensureSchemaCompatibility();
  
  const app = createApp();
  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📄 Documentation available on http://localhost:${port}/api/docs`);
  });
}


