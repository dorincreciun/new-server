# Ghid de Testare - Sistem de Autorizare JWT

## 🚀 Pornire Server

### 1. Configurare variabile de mediu
```bash
# Windows PowerShell
$env:JWT_SECRET="test-secret-key-for-development-only"
$env:NODE_ENV="development"
$env:PORT="3000"

# Linux/Mac
export JWT_SECRET="test-secret-key-for-development-only"
export NODE_ENV="development"
export PORT="3000"
```

### 2. Pornire server
```bash
npm run dev
```

Serverul va porni pe `http://localhost:3000`

## 📋 Testare API

### 1. Health Check
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET

# cURL
curl -X GET http://localhost:3000/health
```

**Răspuns așteptat:**
```json
{
  "status": "ok"
}
```

### 2. Swagger UI
Accesează în browser: `http://localhost:3000/docs`

Aici poți testa toate endpoint-urile interactiv!

## 🔐 Testare Autentificare

### 1. Înregistrare Utilizator

```bash
# PowerShell
$body = @{
    email = "test@example.com"
    name = "Test User"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# cURL
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

**Răspuns așteptat:**
```json
{
  "message": "Utilizator înregistrat cu succes",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "jwt-token-here"
}
```

### 2. Autentificare

```bash
# PowerShell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# cURL
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Obținere Profil

```bash
# PowerShell (înlocuiește TOKEN cu token-ul primit)
$headers = @{
    Authorization = "Bearer TOKEN"
}

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers $headers

# cURL
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### 4. Deconectare

```bash
# PowerShell
$headers = @{
    Authorization = "Bearer TOKEN"
}

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" -Method POST -Headers $headers

# cURL
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

## 🧪 Testare cu Swagger UI

1. Accesează `http://localhost:3000/docs`
2. Explorează secțiunea "Autentificare"
3. Testează fiecare endpoint:
   - **POST /api/auth/register** - Înregistrare
   - **POST /api/auth/login** - Autentificare
   - **GET /api/auth/me** - Profil utilizator
   - **POST /api/auth/logout** - Deconectare

### Autentificare în Swagger:
1. Execută `/api/auth/login` pentru a obține token-ul
2. Copiază token-ul din răspuns
3. Apasă butonul "Authorize" în partea de sus
4. Introdu token-ul în format: `Bearer YOUR_TOKEN_HERE`
5. Acum poți testa endpoint-urile protejate

## 🔍 Scenarii de Test

### Testare Validări

#### 1. Înregistrare cu date invalide
```bash
# Email lipsă
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","password":"password123"}'

# Parolă prea scurtă
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"123"}'

# Email invalid
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","name":"Test","password":"password123"}'
```

#### 2. Autentificare cu credențiale invalide
```bash
# Parolă greșită
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'

# Email inexistent
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"password123"}'
```

#### 3. Acces fără token
```bash
curl -X GET http://localhost:3000/api/auth/me
```

#### 4. Acces cu token invalid
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token"
```

## 📊 Testare Rulare Teste

### Teste unitare
```bash
npm test
```

### Teste cu mock-uri
```bash
npx jest src/__tests__/auth.mock.test.ts
```

## 🐛 Debugging

### Loguri Server
Serverul afișează loguri în consolă pentru:
- Erori de autentificare
- Erori de înregistrare
- Erori de validare

### Verificare Status
```bash
# Verifică dacă serverul rulează
netstat -an | findstr :3000

# Verifică procese Node.js
tasklist | findstr node
```

## ✅ Checklist Testare

- [ ] Serverul pornește fără erori
- [ ] Health check returnează status OK
- [ ] Swagger UI este accesibil
- [ ] Înregistrare utilizator nou funcționează
- [ ] Autentificare cu credențiale valide funcționează
- [ ] Obținere profil cu token valid funcționează
- [ ] Deconectare funcționează
- [ ] Validări pentru date invalide funcționează
- [ ] Acces fără token este refuzat
- [ ] Acces cu token invalid este refuzat
- [ ] Toate endpoint-urile sunt documentate în Swagger

## 🚨 Probleme Cunoscute

1. **Baza de date**: Pentru testare completă, este necesară o bază de date MySQL configurată
2. **Mock-uri**: Testele cu mock-uri pot avea probleme de configurare
3. **Variabile de mediu**: Asigură-te că JWT_SECRET este setat

## 📝 Note

- Token-urile JWT expiră după 24h (configurabil)
- Parolele sunt criptate cu bcryptjs
- Toate endpoint-urile returnează JSON
- Erorile sunt returnate cu coduri HTTP corespunzătoare

