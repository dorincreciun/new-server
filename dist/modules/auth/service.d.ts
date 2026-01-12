import { RegisterInput, LoginInput } from './dto';
export interface UserPayload {
    id: number;
    email: string;
    name: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    login(credentials: LoginInput): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    rotateRefreshToken(refreshToken: string): Promise<{
        user: UserPayload;
        tokens: TokenPair;
    }>;
    logout(userId: number): Promise<void>;
    revokeAllRefreshTokens(userId: number): Promise<void>;
    private generateTokenPair;
    verifyAccessToken(token: string): UserPayload;
}
export declare const authService: AuthService;
//# sourceMappingURL=service.d.ts.map