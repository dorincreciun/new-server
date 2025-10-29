"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const cookieUtils_1 = require("../utils/cookieUtils");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required: [id, email]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: Ion Popescu
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Logged out
 *     AuthRegisterRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         name:
 *           type: string
 *       example:
 *         email: user@example.com
 *         password: secret123
 *         name: Ion
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       example:
 *         email: user@example.com
 *         password: secret123
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       examples:
 *         MissingCredentials:
 *           summary: Lipsesc credențiale
 *           value:
 *             message: Emailul și parola sunt obligatorii
 *         WeakPassword:
 *           summary: Parolă prea scurtă
 *           value:
 *             message: Parola trebuie să aibă cel puțin 6 caractere
 *         InvalidEmail:
 *           summary: Email invalid
 *           value:
 *             message: Adresa de email este invalidă
 *         AccountExists:
 *           summary: Cont deja înregistrat
 *           value:
 *             message: Acest cont a fost deja înregistrat
 *         AccountNotFound:
 *           summary: Cont inexistent
 *           value:
 *             message: Acest cont nu există
 *         WrongPassword:
 *           summary: Parolă incorectă
 *           value:
 *             message: Parola incorectă
 *         Unauthorized:
 *           summary: Neautorizat
 *           value:
 *             message: Unauthorized
 *         ServerError:
 *           summary: Eroare server
 *           value:
 *             message: Eroare internă a serverului
 *   headers:
 *     SetCookieHeader:
 *       description: Header Set-Cookie care conține accesToken și refreshToken ca HTTP-only cookies
 *       schema:
 *         type: string
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         headers:
 *           Set-Cookie:
 *             $ref: '#/components/headers/SetCookieHeader'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               Success:
 *                 summary: Utilizator creat și autentificat
 *                 value:
 *                   user:
 *                     id: 1
 *                     email: user@example.com
 *                     name: Ion
 *       400:
 *         description: Invalid input or account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               MissingCredentials:
 *                 $ref: '#/components/schemas/Error/examples/MissingCredentials'
 *               WeakPassword:
 *                 $ref: '#/components/schemas/Error/examples/WeakPassword'
 *               InvalidEmail:
 *                 $ref: '#/components/schemas/Error/examples/InvalidEmail'
 *               AccountExists:
 *                 $ref: '#/components/schemas/Error/examples/AccountExists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/Error/examples/ServerError'
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Emailul și parola sunt obligatorii' });
        }
        // Normalizează emailul
        const normalizedEmail = String(email).trim().toLowerCase();
        // Validare format email simplă
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: 'Adresa de email este invalidă' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Parola trebuie să aibă cel puțin 6 caractere' });
        }
        const result = await authService_1.authService.register({ email: normalizedEmail, password, name });
        // Setează cookie-urile
        (0, cookieUtils_1.setAuthCookies)(res, result.tokens.accessToken, result.tokens.refreshToken);
        res.status(201).json({
            user: result.user
        });
    }
    catch (error) {
        if (error.message === 'Contul cu acest email există deja' || error.message === 'Email already exists') {
            return res.status(400).json({ message: 'Acest cont a fost deja înregistrat' });
        }
        console.error('Register error:', error);
        res.status(500).json({ message: 'Eroare internă a serverului' });
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             $ref: '#/components/headers/SetCookieHeader'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               Success:
 *                 value:
 *                   user:
 *                     id: 1
 *                     email: user@example.com
 *                     name: Ion
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               MissingCredentials:
 *                 $ref: '#/components/schemas/Error/examples/MissingCredentials'
 *               InvalidEmail:
 *                 $ref: '#/components/schemas/Error/examples/InvalidEmail'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AccountNotFound:
 *                 $ref: '#/components/schemas/Error/examples/AccountNotFound'
 *               WrongPassword:
 *                 $ref: '#/components/schemas/Error/examples/WrongPassword'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/Error/examples/ServerError'
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Emailul și parola sunt obligatorii' });
        }
        // Normalizează și validează emailul
        const normalizedEmail = String(email).trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: 'Adresa de email este invalidă' });
        }
        const result = await authService_1.authService.login({ email: normalizedEmail, password });
        // Setează cookie-urile
        (0, cookieUtils_1.setAuthCookies)(res, result.tokens.accessToken, result.tokens.refreshToken);
        res.json({
            user: result.user
        });
    }
    catch (error) {
        if (error.message === 'Parola incorectă') {
            return res.status(401).json({ message: 'Parola incorectă' });
        }
        if (error.message === 'Acest cont nu există') {
            return res.status(401).json({ message: 'Acest cont nu există' });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Eroare internă a serverului' });
    }
});
// ELIMINAT: POST /auth/refresh - funcționalitate complexă, nu necesară pentru frontend simplu
// ELIMINAT: POST /auth/refresh - funcționalitate complexă, nu necesară pentru frontend simplu
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Returnează utilizatorul autentificat
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               Success:
 *                 value:
 *                   user:
 *                     id: 1
 *                     email: user@example.com
 *                     name: Ion
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/Unauthorized'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/Error/examples/ServerError'
 */
// ELIMINAT: GET /auth/me - funcționalitate complexă, nu necesară pentru frontend simplu
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             description: Cookies cleared (accessToken, refreshToken)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *             examples:
 *               Success:
 *                 value:
 *                   message: Logged out
 *       500:
 *         description: Internal server error (logout still clears cookies and returns 200 in implementation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/Error/examples/ServerError'
 */
router.post('/logout', async (req, res) => {
    try {
        const refreshToken = (0, cookieUtils_1.readRefreshToken)(req);
        if (refreshToken) {
            try {
                const { sub: userId } = authService_1.authService.verifyRefreshToken(refreshToken);
                // Revocă toate refresh token-urile pentru utilizator
                await authService_1.authService.revokeAllRefreshTokens(userId);
            }
            catch (error) {
                // Ignoră eroarea - token-ul poate fi deja invalid
            }
        }
        // Șterge cookie-urile
        (0, cookieUtils_1.clearAuthCookies)(res);
        res.json({ message: 'Logged out' });
    }
    catch (error) {
        console.error('Logout error:', error);
        // Șterge cookie-urile oricum
        (0, cookieUtils_1.clearAuthCookies)(res);
        res.json({ message: 'Logged out' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map