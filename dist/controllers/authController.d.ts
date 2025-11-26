import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class AuthController {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Înregistrează un utilizator nou
     *     tags: [Autentificare]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - name
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Adresa de email
     *               name:
     *                 type: string
     *                 description: Numele utilizatorului
     *               password:
     *                 type: string
     *                 minLength: 6
     *                 description: Parola (minimum 6 caractere)
     *     responses:
     *       201:
     *         description: Utilizator înregistrat cu succes
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                     email:
     *                       type: string
     *                     name:
     *                       type: string
     *                 token:
     *                   type: string
     *                   description: JWT token pentru autentificare
     *       400:
     *         description: Date invalide sau utilizator existent
     *       500:
     *         description: Eroare server
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Autentifică un utilizator existent
     *     tags: [Autentificare]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Adresa de email
     *               password:
     *                 type: string
     *                 description: Parola
     *     responses:
     *       200:
     *         description: Autentificare reușită
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                     email:
     *                       type: string
     *                     name:
     *                       type: string
     *                 token:
     *                   type: string
     *                   description: JWT token pentru autentificare
     *       401:
     *         description: Credențiale invalide
     *       400:
     *         description: Date lipsă
     *       500:
     *         description: Eroare server
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     summary: Obține informațiile utilizatorului autentificat (necesită autentificare prin cookie)
     *     tags: [Autentificare]
     *     responses:
     *       200:
     *         description: Informații utilizator
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                     email:
     *                       type: string
     *                     name:
     *                       type: string
     *       401:
     *         description: Neautentificat
     *       500:
     *         description: Eroare server
     */
    getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     summary: Deconectează utilizatorul (client-side logout)
     *     tags: [Autentificare]
     *     responses:
     *       200:
     *         description: Deconectare reușită
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: Neautentificat
     */
    logout(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=authController.d.ts.map