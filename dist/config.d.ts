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
export declare const config: AppConfig;
export declare function requireEnv(name: string): string;
export {};
//# sourceMappingURL=config.d.ts.map