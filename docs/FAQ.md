# FAQ - Pizza Shop API

Acest document oferă exemple practice de utilizare pentru toate endpoint-urile API și explică când și cum trebuie folosite.

## 📋 Cuprins

1. [Autentificare](#autentificare)
2. [Produse](#produse)
3. [Categorii](#categorii)
4. [Browse & Căutare](#browse--căutare)
5. [Coș de Cumpărături](#coș-de-cumpărături)
6. [Comenzi](#comenzi)
7. [Taxonomii](#taxonomii)
8. [Exemple Complete](#exemple-complete)

---

## 🔐 Autentificare

### POST `/api/auth/register`
**Scop:** Înregistrare utilizator nou în sistem.

**Când să folosești:**
- La primul acces al utilizatorului
- Când utilizatorul dorește să creeze un cont nou
- Înainte de a permite adăugarea produselor în coș

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "parola123",
    "name": "Ion Popescu"
  }'
```

**Exemplu Response (201):**
```json
{
  "message": "Utilizator înregistrat cu succes",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Ion Popescu"
  }
}
```

**Erori comune:**
- `409 Conflict` - Email-ul există deja
- `422 Validation Error` - Date invalide (parolă prea scurtă, email invalid)

---

### POST `/api/auth/login`
**Scop:** Autentificare utilizator existent.

**Când să folosești:**
- La fiecare sesiune nouă
- Când token-ul de acces expiră
- Când utilizatorul se întoarce pe site

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "parola123"
  }'
```

**⚠️ Important:** Cookie-ul `access_token` este setat automat și trebuie trimis la toate request-urile autentificate.

**Exemplu Response (200):**
```json
{
  "message": "Autentificare reușită",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Ion Popescu"
  }
}
```

---

### POST `/api/auth/refresh`
**Scop:** Reînnoire token de acces folosind refresh token.

**Când să folosești:**
- Când token-ul de acces expiră (după 15 minute)
- În background, înainte ca token-ul să expire
- Automat, fără intervenția utilizatorului

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

**Notă:** Refresh token-ul este trimis automat prin cookie HTTP-only.

---

### GET `/api/auth/me`
**Scop:** Obținere informații despre utilizatorul autentificat.

**Când să folosești:**
- La încărcarea paginii pentru a verifica dacă utilizatorul este autentificat
- Pentru a afișa numele utilizatorului în UI
- Pentru a verifica permisiunile utilizatorului

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

**Exemplu Response (200):**
```json
{
  "message": "Utilizator găsit",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Ion Popescu"
  }
}
```

**Eroare comună:**
- `401 Unauthorized` - Utilizatorul nu este autentificat

---

### POST `/api/auth/logout`
**Scop:** Deconectare utilizator și ștergere cookie-uri.

**Când să folosești:**
- Când utilizatorul apasă butonul "Deconectare"
- La închiderea sesiunii

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

## 🍕 Produse

### GET `/api/products`
**Scop:** Listă simplă a tuturor produselor (fără filtrare avansată).

**Când să folosești:**
- Pentru afișarea tuturor produselor pe pagina principală
- Când nu ai nevoie de filtrare sau sortare avansată
- Pentru liste simple de produse

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/products
```

**Exemplu Response (200):**
```json
{
  "message": "Lista de produse",
  "data": [
    {
      "id": 1,
      "name": "Pizza Margherita",
      "imageUrl": "https://example.com/pizza.jpg",
      "minPrice": 25.50,
      "maxPrice": 45.00,
      "ratingAverage": 4.5,
      "ratingCount": 120,
      "popularity": 500,
      "isCustomizable": true,
      "category": {
        "name": "Classic Pizzas",
        "slug": "classic-pizzas"
      }
    }
  ]
}
```

**💡 Recomandare:** Pentru filtrare avansată, folosește `/api/browse/products`.

---

### GET `/api/products/{id}`
**Scop:** Detalii complete despre un produs specific.

**Când să folosești:**
- Când utilizatorul accesează pagina de detalii a unui produs
- Pentru afișarea tuturor variantelor (mărimi, tipuri de aluat)
- Pentru afișarea ingredientelor și flag-urilor

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/products/1 \
  -b cookies.txt
```

**Exemplu Response (200) - Utilizator autentificat:**
```json
{
  "message": "Detalii produs",
  "data": {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Pizza clasică italiană cu sos de roșii, mozzarella și busuioc",
    "imageUrl": "https://example.com/pizza.jpg",
    "minPrice": 25.50,
    "maxPrice": 45.00,
    "ratingAverage": 4.5,
    "ratingCount": 120,
    "popularity": 500,
    "isCustomizable": true,
    "quantityInCart": 2,
    "category": {
      "name": "Classic Pizzas",
      "slug": "classic-pizzas"
    },
    "ingredients": [
      { "id": 1, "key": "mozzarella", "label": "Mozzarella" },
      { "id": 2, "key": "rosii", "label": "Sos de roșii" }
    ],
    "flags": [
      { "id": 1, "key": "vegetarian", "label": "Vegetarian" }
    ],
    "variants": [
      {
        "id": 1,
        "price": 25.50,
        "isDefault": true,
        "doughType": { "key": "clasic", "label": "Aluat Clasic" },
        "sizeOption": { "key": "mica", "label": "Mică (25cm)" }
      }
    ]
  }
}
```

**⚠️ Notă:** `quantityInCart` este prezent doar dacă utilizatorul este autentificat și are produsul în coș.

---

### POST `/api/products` (Admin)
**Scop:** Creare produs nou (doar pentru administratori).

**Când să folosești:**
- În panoul de administrare
- Când adaugi produse noi în catalog

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Pizza Quattro Stagioni",
    "categoryId": 1,
    "basePrice": 30.00,
    "description": "Pizza cu 4 ingrediente de sezon"
  }'
```

**Erori comune:**
- `401 Unauthorized` - Nu ești autentificat
- `403 Forbidden` - Nu ai permisiuni de administrator

---

## 📁 Categorii

### GET `/api/categories`
**Scop:** Listă a tuturor categoriilor disponibile.

**Când să folosești:**
- Pentru afișarea meniului de navigare
- Pentru filtrele de categorii
- La inițializarea paginii principale

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/categories
```

**Exemplu Response (200):**
```json
{
  "message": "Lista de categorii",
  "data": [
    {
      "id": 1,
      "slug": "classic-pizzas",
      "name": "Classic Pizzas",
      "description": "Pizza-uri clasice italiene",
      "count": 15
    },
    {
      "id": 2,
      "slug": "vegetarian-pizzas",
      "name": "Vegetarian Pizzas",
      "description": "Pizza-uri vegetariene",
      "count": 8
    }
  ]
}
```

---

### GET `/api/categories/{slug}`
**Scop:** Detalii despre o categorie specifică.

**Când să folosești:**
- Când utilizatorul accesează o categorie
- Pentru afișarea descrierii categoriei

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/categories/classic-pizzas
```

---

## 🔍 Browse & Căutare

### GET `/api/browse/products`
**Scop:** Căutare și filtrare avansată a produselor.

**Când să folosești:**
- Pentru pagina de căutare cu filtre multiple
- Când utilizatorul aplică filtre (preț, ingrediente, flag-uri)
- Pentru sortare după preț, rating, popularitate, data lansării
- Când utilizatorul caută după text

**Parametri disponibili:**
- `q` - Căutare text (nume produs)
- `categorySlug` - Filtrare după categorie
- `page` - Pagină (default: 1)
- `limit` - Rezultate per pagină (default: 12)
- `sort` - Sortare: `price`, `rating`, `popularity`, `newest`
- `order` - Ordine: `asc`, `desc`
- `priceMin` / `priceMax` - Interval preț
- `flags[]` - Array de flag-uri (ex: `vegetarian`, `picant`)
- `ingredients[]` - Array de ingrediente
- `dough` - Tip aluat (ex: `clasic`, `subtire`)
- `size` - Mărime (ex: `mica`, `medie`, `mare`)

**Exemplu Request - Căutare simplă:**
```bash
curl -X GET "http://localhost:3000/api/browse/products?q=margherita&page=1&limit=12"
```

**Exemplu Request - Filtrare avansată:**
```bash
curl -X GET "http://localhost:3000/api/browse/products?categorySlug=classic-pizzas&priceMin=20&priceMax=40&flags[]=vegetarian&sort=price&order=asc&page=1&limit=12"
```

**Exemplu Response (200):**
```json
{
  "message": "Produse găsite",
  "data": [
    {
      "id": 1,
      "name": "Pizza Margherita",
      "minPrice": 25.50,
      "maxPrice": 45.00,
      "category": {
        "name": "Classic Pizzas",
        "slug": "classic-pizzas"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

**💡 Sfat:** Folosește acest endpoint pentru toate funcționalitățile de căutare și filtrare.

---

### GET `/api/browse/filters`
**Scop:** Obținere opțiuni disponibile pentru filtre.

**Când să folosești:**
- La inițializarea paginii de căutare
- Pentru a popula dropdown-urile cu filtre
- Când utilizatorul selectează o categorie și vrei să afișezi filtrele disponibile

**Exemplu Request:**
```bash
curl -X GET "http://localhost:3000/api/browse/filters?categorySlug=classic-pizzas"
```

**Exemplu Response (200):**
```json
{
  "message": "Filtre disponibile",
  "data": {
    "price": {
      "min": 15.00,
      "max": 60.00
    },
    "categories": [
      {
        "id": 1,
        "slug": "classic-pizzas",
        "name": "Classic Pizzas",
        "count": 15
      }
    ],
    "flags": [
      { "key": "vegetarian", "label": "Vegetarian", "count": 8 },
      { "key": "picant", "label": "Picant", "count": 5 }
    ],
    "ingredients": [
      { "key": "mozzarella", "label": "Mozzarella", "count": 20 },
      { "key": "salam", "label": "Salam", "count": 12 }
    ]
  }
}
```

---

### GET `/api/browse/suggest`
**Scop:** Sugestii de căutare (autocomplete).

**Când să folosești:**
- În câmpul de căutare, când utilizatorul tastează
- Pentru funcționalitatea de autocomplete
- Când vrei să sugerezi produse înainte ca utilizatorul să termine de scris

**Exemplu Request:**
```bash
curl -X GET "http://localhost:3000/api/browse/suggest?q=marg&limit=5"
```

**Exemplu Response (200):**
```json
{
  "message": "Sugestii găsite",
  "data": [
    { "id": 1, "name": "Pizza Margherita" },
    { "id": 2, "name": "Pizza Margherita Special" }
  ]
}
```

**💡 Sfat:** Folosește `limit=5` pentru a limita numărul de sugestii.

---

## 🛒 Coș de Cumpărături

**⚠️ Toate endpoint-urile de coș necesită autentificare!**

### GET `/api/cart`
**Scop:** Obținere conținutul coșului utilizatorului.

**Când să folosești:**
- La încărcarea paginii de coș
- După adăugarea/ștergerea unui produs
- Pentru afișarea totalului în header

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/cart \
  -b cookies.txt
```

**Exemplu Response (200):**
```json
{
  "message": "Coș găsit",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 501,
        "product": {
          "id": 1,
          "name": "Pizza Margherita",
          "imageUrl": "https://example.com/pizza.jpg"
        },
        "variant": {
          "id": 10,
          "price": 25.50,
          "doughType": { "key": "clasic", "label": "Aluat Clasic" },
          "sizeOption": { "key": "mica", "label": "Mică (25cm)" }
        },
        "quantity": 2,
        "lineTotal": 51.00
      }
    ],
    "subtotal": 51.00,
    "discounts": 0,
    "total": 51.00
  }
}
```

---

### POST `/api/cart/items`
**Scop:** Adăugare produs în coș.

**Când să folosești:**
- Când utilizatorul apasă "Adaugă în coș"
- Când utilizatorul selectează o variantă (mărime, aluat) și o adaugă

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productVariantId": 10,
    "quantity": 2
  }'
```

**⚠️ Important:** `productVariantId` este ID-ul variantei (nu al produsului!), obținut din `/api/products/{id}`.

**Exemplu Response (200):**
```json
{
  "message": "Produs adăugat în coș",
  "data": {
    "id": 1,
    "items": [...],
    "total": 51.00
  }
}
```

**Erori comune:**
- `404 Not Found` - Varianta produsului nu există
- `422 Validation Error` - Cantitate invalidă

---

### PATCH `/api/cart/items/{itemId}`
**Scop:** Actualizare cantitate pentru un item din coș.

**Când să folosești:**
- Când utilizatorul modifică cantitatea în coș
- Când utilizatorul folosește butoanele +/- pentru cantitate

**Exemplu Request:**
```bash
curl -X PATCH http://localhost:3000/api/cart/items/501 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "quantity": 3
  }'
```

---

### DELETE `/api/cart/items/{itemId}`
**Scop:** Ștergere item din coș.

**Când să folosești:**
- Când utilizatorul apasă butonul "Șterge" pentru un item
- Când utilizatorul vrea să elimine un produs din coș

**Exemplu Request:**
```bash
curl -X DELETE http://localhost:3000/api/cart/items/501 \
  -b cookies.txt
```

---

### DELETE `/api/cart`
**Scop:** Golire completă a coșului.

**Când să folosești:**
- Când utilizatorul apasă "Golește coșul"
- După finalizarea unei comenzi (opțional)

**Exemplu Request:**
```bash
curl -X DELETE http://localhost:3000/api/cart \
  -b cookies.txt
```

---

## 📦 Comenzi

### POST `/api/checkout`
**Scop:** Creare comandă din coșul utilizatorului.

**Când să folosești:**
- Când utilizatorul finalizează comanda
- După ce utilizatorul completează formularul de livrare
- La finalizarea procesului de checkout

**⚠️ Important:** Coșul este golit automat după crearea comenzii.

**Exemplu Request:**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "customer": {
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "phone": "+40123456789"
    },
    "address": {
      "city": "București",
      "street": "Strada Exemplu",
      "house": "10",
      "apartment": "5",
      "comment": "Etaj 2, interfon 25"
    },
    "paymentMethod": "CASH"
  }'
```

**Exemplu Response (201):**
```json
{
  "message": "Comandă creată cu succes",
  "data": {
    "id": 100,
    "status": "PENDING",
    "total": 51.00,
    "subtotal": 51.00,
    "discounts": 0,
    "customerName": "Ion Popescu",
    "customerEmail": "ion@example.com",
    "customerPhone": "+40123456789",
    "addressCity": "București",
    "addressStreet": "Strada Exemplu",
    "addressHouse": "10",
    "addressApartment": "5",
    "paymentMethod": "CASH",
    "items": [
      {
        "id": 1,
        "productName": "Pizza Margherita",
        "quantity": 2,
        "unitPrice": 25.50
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erori comune:**
- `401 Unauthorized` - Utilizatorul nu este autentificat
- `422 Validation Error` - Date invalide (adresă incompletă, etc.)
- `400 Bad Request` - Coșul este gol

---

### GET `/api/orders`
**Scop:** Listă comenzi ale utilizatorului autentificat.

**Când să folosești:**
- În pagina "Istoric comenzi"
- Pentru afișarea comenzilor utilizatorului
- Pentru paginare prin comenzile utilizatorului

**Parametri:**
- `page` - Pagină (default: 1)
- `limit` - Rezultate per pagină (default: 10)

**Exemplu Request:**
```bash
curl -X GET "http://localhost:3000/api/orders?page=1&limit=10" \
  -b cookies.txt
```

**Exemplu Response (200):**
```json
{
  "message": "Comenzi găsite",
  "data": [
    {
      "id": 100,
      "status": "COMPLETED",
      "total": 51.00,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### GET `/api/orders/{id}`
**Scop:** Detalii despre o comandă specifică.

**Când să folosești:**
- Când utilizatorul accesează pagina de detalii a unei comenzi
- Pentru afișarea informațiilor complete despre comandă
- Pentru tracking-ul comenzii

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/orders/100 \
  -b cookies.txt
```

**⚠️ Notă:** Utilizatorul poate accesa doar propriile comenzi.

---

## 🏷️ Taxonomii

### GET `/api/taxonomies/ingredients`
**Scop:** Listă a tuturor ingredientelor disponibile.

**Când să folosești:**
- Pentru filtrele de ingrediente
- Pentru afișarea ingredientelor în UI
- Pentru autocomplete la căutare

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/taxonomies/ingredients
```

**Exemplu Response (200):**
```json
{
  "message": "Lista de ingrediente",
  "data": [
    { "id": 1, "key": "mozzarella", "label": "Mozzarella" },
    { "id": 2, "key": "salam", "label": "Salam" },
    { "id": 3, "key": "ciuperci", "label": "Ciuperci" }
  ]
}
```

---

### GET `/api/taxonomies/flags`
**Scop:** Listă a tuturor flag-urilor disponibile (vegetarian, picant, etc.).

**Când să folosești:**
- Pentru filtrele de tipuri (vegetarian, picant)
- Pentru afișarea badge-urilor pe produse

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/taxonomies/flags
```

---

### GET `/api/taxonomies/dough-types`
**Scop:** Listă a tipurilor de aluat disponibile.

**Când să folosești:**
- Pentru dropdown-ul de selecție aluat
- Când utilizatorul configurează o pizza

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/taxonomies/dough-types
```

---

### GET `/api/taxonomies/size-options`
**Scop:** Listă a mărimilor disponibile.

**Când să folosești:**
- Pentru dropdown-ul de selecție mărime
- Când utilizatorul selectează mărimea pizza-ului

**Exemplu Request:**
```bash
curl -X GET http://localhost:3000/api/taxonomies/size-options
```

---

## 🎯 Exemple Complete

### Flux complet: Căutare → Adăugare în coș → Comandă

#### 1. Căutare produse
```bash
curl -X GET "http://localhost:3000/api/browse/products?q=margherita&flags[]=vegetarian"
```

#### 2. Obținere detalii produs
```bash
curl -X GET http://localhost:3000/api/products/1 \
  -b cookies.txt
```

#### 3. Adăugare în coș (folosind variantId din răspunsul anterior)
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productVariantId": 10,
    "quantity": 2
  }'
```

#### 4. Verificare coș
```bash
curl -X GET http://localhost:3000/api/cart \
  -b cookies.txt
```

#### 5. Finalizare comandă
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "customer": {
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "phone": "+40123456789"
    },
    "address": {
      "city": "București",
      "street": "Strada Exemplu",
      "house": "10"
    },
    "paymentMethod": "CASH"
  }'
```

---

## 🔧 Configurare Client

### JavaScript/TypeScript (fetch)

```typescript
const API_BASE = 'http://localhost:3000/api';

// Request cu autentificare
async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Important pentru cookie-uri!
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

// Exemplu: Obținere produse
const products = await authenticatedFetch('/products');
const data = await products.json();
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important pentru cookie-uri!
});

// Exemplu: Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'parola123',
});
```

---

## ❓ Întrebări Frecvente

### Cum funcționează autentificarea?
Autentificarea folosește cookie-uri HTTP-only. După login, cookie-ul `access_token` este setat automat și trebuie trimis la toate request-urile autentificate folosind `credentials: 'include'` sau `withCredentials: true`.

### Ce este `productVariantId`?
`productVariantId` este ID-ul unei variante specifice a unui produs (combinație de mărime și tip de aluat). Obții acest ID din răspunsul `/api/products/{id}` în array-ul `variants`.

### Când să folosesc `/api/products` vs `/api/browse/products`?
- `/api/products` - Pentru liste simple, fără filtrare
- `/api/browse/products` - Pentru căutare și filtrare avansată

### Cum obțin `quantityInCart` pentru un produs?
`quantityInCart` este inclus automat în răspunsul `/api/products/{id}` dacă utilizatorul este autentificat și are produsul în coș.

### Ce se întâmplă cu coșul după checkout?
Coșul este golit automat după crearea comenzii prin `/api/checkout`.

---

## 📚 Resurse Suplimentare

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI Spec**: http://localhost:3000/api/docs/openapi.yaml
- **TypeScript Schema**: http://localhost:3000/api/docs/schema.d.ts

---

*Ultima actualizare: 2024-01-15*

