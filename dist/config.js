"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.requireEnv = requireEnv;
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env or .env.test depending on NODE_ENV
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv_1.default.config({ path: envPath });
function resolveJwtAccessSecret() {
    const isProd = process.env.NODE_ENV === 'production';
    const fromEnv = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET; // fallback pentru compatibilitate .env vechi
    if (fromEnv)
        return fromEnv;
    if (!isProd) {
        return 'acc_secret_please_change_in_prod_7b2b9e1d';
    }
    throw new Error('Missing required env var JWT_ACCESS_SECRET');
}
function resolveJwtRefreshSecret() {
    const isProd = process.env.NODE_ENV === 'production';
    const fromEnv = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET; // fallback pentru compatibilitate .env vechi
    if (fromEnv)
        return fromEnv;
    if (!isProd) {
        return 'ref_secret_please_change_in_prod_83f1c4a6';
    }
    throw new Error('Missing required env var JWT_REFRESH_SECRET');
}
exports.config = {
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
    cookieSameSite: process.env.COOKIE_SAMESITE ?? 'lax',
};
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var ${name}`);
    }
    return value;
}
//# sourceMappingURL=config.js.map