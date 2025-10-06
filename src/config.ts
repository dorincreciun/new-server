import dotenv from 'dotenv';

// Load .env or .env.test depending on NODE_ENV
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

type AppConfig = {
  nodeEnv: string;
  port: number;
  databaseUrl: string | undefined;
  swaggerTitle: string;
  swaggerVersion: string;
  swaggerServerUrl: string | undefined;
  jwtSecret: string;
  jwtExpiresIn: string;
};

function resolveJwtSecret(): string {
  // In production we require JWT_SECRET to be set explicitly
  const isProd = process.env.NODE_ENV === 'production';
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv) return fromEnv;
  if (!isProd) {
    // Provide a safe default for non-production to avoid boot-time crashes
    return 'dev-secret-change-me';
  }
  throw new Error('Missing required env var JWT_SECRET');
}

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  swaggerTitle: process.env.SWAGGER_TITLE ?? 'API',
  swaggerVersion: process.env.SWAGGER_VERSION ?? '1.0.0',
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL,
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}


