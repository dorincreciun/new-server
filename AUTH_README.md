# Sistem de Autorizare JWT

Acest proiect implementează un sistem modern de autorizare folosind JWT (JSON Web Tokens) cu Express.js, Prisma și MySQL.

## Funcționalități

### 🔐 Autentificare
- **Înregistrare utilizatori** - Crearea de conturi noi cu validare
- **Autentificare** - Login cu email și parolă
- **Deconectare** - Logout (client-side)
- **Profil utilizator** - Obținerea informațiilor utilizatorului autentificat

### 🛡️ Securitate
- Parole criptate cu bcryptjs (12 salt rounds)
- JWT tokens cu expirare configurabilă
- Middleware de autentificare
- Validare completă a datelor

### 📚 API Documentation
- Swagger UI integrat la `/docs`
- Documentație completă pentru toate endpoint-urile
- Testare interactivă din interfață

## Configurare

### 1. Instalare dependențe
```bash
npm install
```

### 2. Configurare bază de date
```bash
# Copiază fișierul de configurare
cp env.example .env

# Editează .env cu datele tale
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 3. Configurare bază de date
```bash
# Generează clientul Prisma
npx prisma generate

# Rulează migrațiile
npx prisma db push
```

### 4. Pornire server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Autentificare

#### POST `/api/auth/register`
Înregistrează un utilizator nou.

**Body:**
```json
{
  "email": "user@example.com",
  "name": "Nume Utilizator",
  "password": "parola123"
}
```

**Răspuns:**
```json
{
  "message": "Utilizator înregistrat cu succes",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nume Utilizator"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/login`
Autentifică un utilizator existent.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "parola123"
}
```

**Răspuns:**
```json
{
  "message": "Autentificare reușită",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nume Utilizator"
  },
  "token": "jwt-token-here"
}
```

#### GET `/api/auth/me`
Obține informațiile utilizatorului autentificat.

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Răspuns:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nume Utilizator"
  }
}
```

#### POST `/api/auth/logout`
Deconectează utilizatorul.

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Răspuns:**
```json
{
  "message": "Deconectare reușită. Ștergeți token-ul de pe client."
}
```

## Testare

### Rulare teste
```bash
npm test
```

### Testare manuală cu Swagger
1. Pornește serverul: `npm run dev`
2. Accesează http://localhost:3000/docs
3. Testează endpoint-urile din interfața Swagger

### Testare cu cURL

#### Înregistrare
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

#### Autentificare
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Obținere profil
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Structura Proiectului

```
src/
├── controllers/
│   └── authController.ts      # Controller pentru autentificare
├── middleware/
│   └── auth.ts               # Middleware de autentificare
├── routes/
│   └── authRoutes.ts         # Rute pentru autentificare
├── services/
│   └── authService.ts        # Servicii pentru autentificare
├── __tests__/
│   └── auth.test.ts          # Teste pentru API
├── config.ts                 # Configurație aplicație
├── index.ts                  # Punct de intrare
└── server.ts                 # Configurație server Express
```

## Securitate

- **Parole**: Criptate cu bcryptjs (12 salt rounds)
- **JWT**: Tokens cu expirare configurabilă
- **Validare**: Validare completă a datelor de intrare
- **CORS**: Configurabil prin middleware
- **Rate Limiting**: Poate fi adăugat pentru producție

## Variabile de Mediu

| Variabilă | Descriere | Exemplu |
|-----------|-----------|---------|
| `DATABASE_URL` | URL bază de date MySQL | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Cheie secretă pentru JWT | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Expirare token | `24h` |
| `PORT` | Port server | `3000` |
| `NODE_ENV` | Mediu de rulare | `development` |

## Dezvoltare

### Adăugare noi endpoint-uri
1. Adaugă ruta în `src/routes/authRoutes.ts`
2. Implementează logica în `src/controllers/authController.ts`
3. Adaugă documentația Swagger
4. Scrie teste în `src/__tests__/`

### Extindere funcționalități
- Adăugare roluri utilizatori
- Implementare refresh tokens
- Adăugare rate limiting
- Integrare cu servicii externe (Google, Facebook)

## Probleme Cunoscute

- Logout-ul se face în principal pe client (JWT este stateless)
- Nu există refresh token (poate fi adăugat)
- Rate limiting nu este implementat (recomandat pentru producție)

## Contribuții

1. Fork proiectul
2. Creează o ramură pentru feature
3. Commit modificările
4. Push la ramură
5. Creează Pull Request

## Licență

ISC
