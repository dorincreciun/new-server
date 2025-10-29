export interface UserPayload {
    id: number;
    email: string;
    name: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    name?: string;
    password: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    /**
     * Înregistrează un utilizator nou
     */
    register(data: RegisterData): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    /**
     * Autentifică un utilizator existent
     */
    login(credentials: LoginCredentials): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    /**
     * Verifică și decodează un access token JWT
     */
    verifyAccessToken(token: string): UserPayload;
    /**
     * Verifică și decodează un refresh token JWT
     */
    verifyRefreshToken(token: string): {
        sub: number;
        jti: string;
    };
    /**
     * Rotește refresh token-ul și returnează un nou set de tokenuri
     */
    rotateRefreshToken(refreshToken: string, userAgent?: string, ipAddress?: string): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    /**
     * Revocă toate refresh token-urile pentru un utilizator
     */
    revokeAllRefreshTokens(userId: number): Promise<void>;
    /**
     * Generează un pair de tokenuri (access + refresh)
     */
    private generateTokenPair;
    /**
     * Verifică dacă un refresh token este valid în baza de date
     */
    validateRefreshToken(refreshToken: string): Promise<boolean>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map