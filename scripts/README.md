# Scripturi pentru Documentație și Generare Client

Acest director conține scripturi pentru gestionarea documentației OpenAPI și generarea clientului TypeScript.

## Scripturi Disponibile

### `update-docs.ts`
Actualizează documentația completă:
- Copiază `openapi.yaml` în `dist/docs`
- Regenerează `schema.d.ts` din `openapi.yaml`
- Copiază `schema.d.ts` în `dist/docs`

**Utilizare:**
```bash
npm run update:docs
```

### `generate-client.ts`
Generează clientul TypeScript pentru frontend din spec-ul OpenAPI.

**Utilizare:**
```bash
# Generare în directorul implicit (generated/client/)
npm run generate:client

# Generare în director personalizat
npm run generate:client -- --output=./frontend/src/api/types
```

**Output:**
- `generated/client/api-client.d.ts` - Tipuri TypeScript pentru toate endpoint-urile și schemele

### `generate-types.ts` (via npm script)
Regenerează schema TypeScript din `openapi.yaml`.

**Utilizare:**
```bash
npm run generate:types
```

## Workflow Recomandat

### 1. După modificarea `src/docs/openapi.yaml`:
```bash
# Regenerează schema TypeScript
npm run generate:types

# Actualizează documentația în dist/
npm run update:docs
```

### 2. Pentru build complet:
```bash
# Build + actualizare documentație
npm run build
```

### 3. Pentru generarea clientului frontend:
```bash
# Generează clientul TypeScript
npm run generate:client -- --output=./frontend/src/api/types
```

## Structura Documentației

- `src/docs/openapi.yaml` - Spec OpenAPI principală (sursa de adevăr)
- `src/docs/schema.d.ts` - Schema TypeScript generată automat
- `dist/docs/openapi.yaml` - Spec servită prin Swagger UI
- `dist/docs/schema.d.ts` - Schema servită pentru download

## Endpoints Documentație

Când serverul rulează:
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI Spec**: http://localhost:3000/api/docs/openapi.yaml
- **TypeScript Schema**: http://localhost:3000/api/docs/schema.d.ts

