# Ghid de Rulare - Pizza Shop API Refactored

## Cerințe
- Node.js >= 18
- MySQL
- Prisma CLI

## Instalare
1. Clonează depozitul.
2. Rulează `npm install`.
3. Configurează `.env` (DATABASE_URL, JWT_ACCESS_SECRET, etc.).

## Generare Tipuri și OpenAPI
Acest proiect folosește OpenAPI-first. Orice modificare în schema API se face în `src/docs/openapi.yaml`.

```bash
# Generează tipurile TypeScript din OpenAPI
npm run generate:types
```

## Rulare Dezvoltare
```bash
npm run dev
```
Serverul va porni pe portul 3000 (implicit).
- API: `http://localhost:3000/api`
- Documentație Swagger UI: `http://localhost:3000/api/docs`

## Testare
Proiectul folosește Jest și Supertest.
```bash
npm test
```

## Structură Proiect
- `src/modules/`: Module grupate pe funcționalitate (Auth, Cart, Browse, etc.). Fiecare modul conține rute, controllere și servicii.
- `src/shared/`: Cod partajat (middleware, prisma client, response helpers, erori).
- `src/docs/`: Schema OpenAPI 3.0.
- `src/tests/`: Teste de integrare.

## Tehnologii Folosite
- **Express 5**: Framework web.
- **Prisma**: ORM pentru MySQL.
- **Zod**: Validare input.
- **Argon2**: Hashing parole.
- **JWT**: Autentificare bazată pe token-uri.
- **OpenAPI 3.0**: Documentație și contract API.
- **TypeScript**: Tipizare strictă.
