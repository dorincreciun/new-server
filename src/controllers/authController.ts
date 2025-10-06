import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
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
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, password } = req.body;

      // Validare simplă
      if (!email || !name || !password) {
        res.status(400).json({
          error: 'Date lipsă',
          message: 'Toate câmpurile sunt obligatorii'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          error: 'Parolă prea scurtă',
          message: 'Parola trebuie să aibă minimum 6 caractere'
        });
        return;
      }

      // Validare email simplă
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Email invalid',
          message: 'Furnizați o adresă de email validă'
        });
        return;
      }

      const result = await authService.register({ email, name, password });
      
      res.status(201).json({
        message: 'Utilizator înregistrat cu succes',
        ...result
      });
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      res.status(400).json({
        error: 'Eroare la înregistrare',
        message: error instanceof Error ? error.message : 'Eroare necunoscută'
      });
    }
  }

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
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validare simplă
      if (!email || !password) {
        res.status(400).json({
          error: 'Date lipsă',
          message: 'Email și parola sunt obligatorii'
        });
        return;
      }

      const result = await authService.login({ email, password });
      
      res.status(200).json({
        message: 'Autentificare reușită',
        ...result
      });
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      res.status(401).json({
        error: 'Autentificare eșuată',
        message: error instanceof Error ? error.message : 'Credențiale invalide'
      });
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Obține informațiile utilizatorului autentificat
   *     tags: [Autentificare]
   *     security:
   *       - bearerAuth: []
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
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Neautentificat',
          message: 'Token de autentificare necesar'
        });
        return;
      }

      res.status(200).json({
        user: req.user
      });
    } catch (error) {
      console.error('Eroare la obținerea profilului:', error);
      res.status(500).json({
        error: 'Eroare server',
        message: 'Nu s-au putut obține informațiile utilizatorului'
      });
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Deconectează utilizatorul (client-side logout)
   *     tags: [Autentificare]
   *     security:
   *       - bearerAuth: []
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
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Pentru JWT, logout-ul se face în principal pe client
      // Aici putem înregistra acțiunea de logout pentru audit
      res.status(200).json({
        message: 'Deconectare reușită. Ștergeți token-ul de pe client.'
      });
    } catch (error) {
      console.error('Eroare la deconectare:', error);
      res.status(500).json({
        error: 'Eroare server',
        message: 'Eroare la procesarea cererii de deconectare'
      });
    }
  }
}

export const authController = new AuthController();
