import request from 'supertest';
import { createApp } from '../server';

const app = createApp();

describe('API Autentificare', () => {
  let testUser: any;
  let authToken: string;

  describe('POST /api/auth/register', () => {
    it('ar trebui să înregistreze un utilizator nou cu date valide', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const response = await request(app)
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

    it('ar trebui să refuze înregistrarea cu email duplicat', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Another User',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Eroare la înregistrare');
    });

    it('ar trebui să refuze înregistrarea cu date lipsă', async () => {
      const response = await request(app)
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

      const response = await request(app)
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

      const response = await request(app)
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

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(credentials.email);
      expect(response.body.user.name).toBe('Test User');
    });

    it('ar trebui să refuze autentificarea cu credențiale invalide', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Autentificare eșuată');
    });

    it('ar trebui să refuze autentificarea cu utilizator inexistent', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Autentificare eșuată');
    });

    it('ar trebui să refuze autentificarea cu date lipsă', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Date lipsă');
    });
  });

  describe('GET /api/auth/me', () => {
    it('ar trebui să returneze profilul utilizatorului autentificat', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.id).toBe(testUser.id);
    });

    it('ar trebui să refuze accesul fără token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acces necesar');
    });

    it('ar trebui să refuze accesul cu token invalid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token invalid');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('ar trebui să permită deconectarea utilizatorului autentificat', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Deconectare reușită');
    });

    it('ar trebui să refuze deconectarea fără token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acces necesar');
    });
  });

  describe('Health Check', () => {
    it('ar trebui să returneze status OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });
});
