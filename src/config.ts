import dotenv from 'dotenv';

dotenv.config();

type AppConfig = {
  nodeEnv: string;
  port: number;
  databaseUrl: string | undefined;
  swaggerTitle: string;
  swaggerVersion: string;
  swaggerServerUrl: string | undefined;
};

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  swaggerTitle: process.env.SWAGGER_TITLE ?? 'API',
  swaggerVersion: process.env.SWAGGER_VERSION ?? '1.0.0',
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL,
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}


