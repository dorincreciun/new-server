## Server backend (Express + TypeScript + Prisma + Swagger)

### Cerințe minime
- Node.js 18+
- MySQL (variabilă `DATABASE_URL` în format: `mysql://user:pass@host:port/db`)

### Configurare
1. Copiază `.env.example` în `.env` și completează valorile.
2. Instalează dependențe: `npm install`

### Scripturi utile
- `npm run dev` — pornește serverul în TypeScript (ts-node)
- `npm run build` — compilează în `dist/`
- `npm start` — rulează build-ul compilat

### Endpoint-uri
- `GET /health` — verificare stare
- `GET /docs` — Swagger UI
- `GET /openapi.yaml` — specificația OpenAPI în format YAML

### Prisma
1. Editează `prisma/schema.prisma` pentru modele.
2. Setează `DATABASE_URL` în `.env`.
3. Rulează migrarea: `npx prisma migrate dev` (după ce confirmi schema).

### Variabile .env
- `NODE_ENV` — implicit `development`
- `PORT` — portul serverului, implicit `3000`
- `DATABASE_URL` — conexiune MySQL, ex: `mysql://user:password@localhost:3306/new_server`
- `SWAGGER_TITLE` — titlul afișat în Swagger UI, implicit `API`
- `SWAGGER_VERSION` — versiunea API, implicit `1.0.0`
- `SWAGGER_SERVER_URL` — URL de server pentru OpenAPI (opțional). Dacă lipsește, se folosește `http://localhost:${PORT}`


