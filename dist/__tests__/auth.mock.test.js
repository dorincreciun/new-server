"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = require("../routes/authRoutes");
// Mock Prisma pentru testare
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    })),
}));
// Mock bcryptjs
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
}));
// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com', name: 'Test User' }),
}));
// Mock config
jest.mock('../config', () => ({
    config: {
        jwtSecret: 'test-secret',
        jwtExpiresIn: '24h',
    },
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.authRoutes);
describe('API Autentificare (Mock)', () => {
    let testUser;
    let authToken;
    let mockPrismaClient;
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        // Get the mock instance
        const { PrismaClient } = require('@prisma/client');
        mockPrismaClient = new PrismaClient();
    });
    describe('POST /api/auth/register', () => {
        it('ar trebui să înregistreze un utilizator nou cu date valide', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123'
            };
            // Mock Prisma responses
            mockPrismaClient.user.findUnique.mockResolvedValue(null); // User doesn't exist
            mockPrismaClient.user.create.mockResolvedValue({
                id: 1,
                email: userData.email,
                name: userData.name,
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
            expect(response.body.user).not.toHaveProperty('password');
            testUser = response.body.user;
            authToken = response.body.token;
        });
        it('ar trebui să refuze înregistrarea cu date lipsă', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({})
                .expect(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Date lipsă');
        });
        it('ar trebui să refuze înregistrarea cu parolă prea scurtă', async () => {
            const userData = {
                email: 'short@example.com',
                name: 'Short Password',
                password: '123'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Parolă prea scurtă');
        });
        it('ar trebui să refuze înregistrarea cu email invalid', async () => {
            const userData = {
                email: 'invalid-email',
                name: 'Invalid Email',
                password: 'password123'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Email invalid');
        });
    });
    describe('POST /api/auth/login', () => {
        it('ar trebui să autentifice un utilizator cu credențiale valide', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'password123'
            };
            // Mock Prisma responses
            mockPrismaClient.user.findUnique.mockResolvedValue({
                id: 1,
                email: credentials.email,
                name: 'Test User',
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe(credentials.email);
            expect(response.body.user.name).toBe('Test User');
        });
        it('ar trebui să refuze autentificarea cu date lipsă', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Date lipsă');
        });
    });
    describe('GET /api/auth/me', () => {
        it('ar trebui să returneze profilul utilizatorului autentificat', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer mock-jwt-token')
                .expect(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user.name).toBe('Test User');
            expect(response.body.user.id).toBe(1);
        });
        it('ar trebui să refuze accesul fără token', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .expect(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Token de acces necesar');
        });
        it('ar trebui să refuze accesul cu token invalid', async () => {
            // Mock jwt.verify to throw error
            const jwt = require('jsonwebtoken');
            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Token invalid');
        });
    });
    describe('POST /api/auth/logout', () => {
        it('ar trebui să permită deconectarea utilizatorului autentificat', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer mock-jwt-token')
                .expect(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Deconectare reușită');
        });
        it('ar trebui să refuze deconectarea fără token', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/logout')
                .expect(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Token de acces necesar');
        });
    });
});
//# sourceMappingURL=auth.mock.test.js.map