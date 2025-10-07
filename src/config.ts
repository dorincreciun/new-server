import dotenv from 'dotenv';

// Load .env or .env.test depending on NODE_ENV
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

type AppConfig = {
  nodeEnv: string;
  port: number;
  clientOrigin: string;
  databaseUrl: string | undefined;
  swaggerTitle: string;
  swaggerVersion: string;
  swaggerServerUrl: string | undefined;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  cookieDomain: string;
  cookieSecure: boolean;
  cookieSameSite: 'strict' | 'lax' | 'none';
};

function resolveJwtAccessSecret(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const fromEnv = process.env.JWT_ACCESS_SECRET;
  if (fromEnv) return fromEnv;
  if (!isProd) {
    return 'acc_secret_please_change_in_prod_7b2b9e1d';
  }
  throw new Error('Missing required env var JWT_ACCESS_SECRET');
}

function resolveJwtRefreshSecret(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const fromEnv = process.env.JWT_REFRESH_SECRET;
  if (fromEnv) return fromEnv;
  if (!isProd) {
    return 'ref_secret_please_change_in_prod_83f1c4a6';
  }
  throw new Error('Missing required env var JWT_REFRESH_SECRET');
}

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  swaggerTitle: process.env.SWAGGER_TITLE ?? 'API',
  swaggerVersion: process.env.SWAGGER_VERSION ?? '1.0.0',
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL,
  jwtAccessSecret: resolveJwtAccessSecret(),
  jwtRefreshSecret: resolveJwtRefreshSecret(),
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900),
  refreshTokenTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL_SECONDS ?? 2592000),
  cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieSameSite: (process.env.COOKIE_SAMESITE as 'strict' | 'lax' | 'none') ?? 'lax',
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}


