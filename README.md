# 🍕 Pizza Shop API

API pentru magazinul de pizza cu autentificare JWT, navigare produse cu filtre și taxonomii.

## 🚀 Caracteristici

- **Autentificare JWT** cu refresh tokens
- **Categorii de pizza** (Clasice, Vegetariene, Picante, Speciale)
- **Produse cu ingrediente** și variante (mărimi, tipuri de aluat)
- **Filtrare avansată** după categorie, ingrediente, flaguri, preț
- **Taxonomii** pentru ingrediente, flaguri, tipuri de aluat, mărimi
- **API curat** fără funcționalități administrative

## 📊 Structura bazei de date

### Categorii
- **Pizza Clasice** - Pizza tradiționale italiene
- **Pizza Vegetariene** - Pizza fără carne
- **Pizza Picante** - Pizza cu ingrediente iuți
- **Pizza Speciale** - Pizza cu combinații unice

### Produse
- **Pizza Margherita** - Clasică cu mozzarella și busuioc
- **Pizza Quattro Stagioni** - Cu ingrediente din toate anotimpurile
- **Pizza Diavola** - Picantă cu salam și chili
- **Pizza Vegetariana** - Fără carne cu legume
- **Pizza Quattro Formaggi** - Cu patru tipuri de brânză
- **Pizza Hawaiian** - Cu prosciutto și ananas

### Ingrediente (20+)
Mozzarella, Parmezan, Salam, Pepperoni, Ciuperci, Măsline, Roșii, Ardei, Ceapă, Usturoi, Busuioc, Chili, Jalapeño, Ananas, Rucola, etc.

### Flaguri
Vegetarian, Vegan, Picant, Premium, Popular, Nou, Fără Lactoză, Fără Gluten

### Variante
- **Mărimi**: Mică (25cm), Medie (30cm), Mare (35cm), Familie (40cm)
- **Tipuri de aluat**: Clasic, Subțire, Gros, Integral, Fără Gluten

## 🛠️ Tehnologii

- **Node.js** + **TypeScript**
- **Express.js** pentru API
- **Prisma** ORM cu MySQL
- **JWT** pentru autentificare
- **Swagger/OpenAPI** pentru documentație

## 🚀 Instalare și rulare

```bash
# Instalare dependențe
npm install

# Configurare baza de date
cp .env.example .env
# Editează .env cu datele bazei de date

# Sincronizare schema
npx prisma db push

# Populare cu date de pizza
npx ts-node scripts/seed-pizza-data.ts

# Rulare în development
npm run dev

# Rulare în producție
npm run build
npm start
```

## 📚 Documentație API

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI YAML**: http://localhost:3000/openapi.yaml

## 🔗 Endpoint-uri principale

### Autentificare
- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Autentificare
- `POST /api/auth/logout` - Deconectare
- `POST /api/auth/refresh` - Refresh token

### Categorii
- `GET /api/categories` - Lista categorii
- `GET /api/categories/:slug` - Categorie după slug

### Produse
- `GET /api/products` - Lista produse
- `GET /api/products/:id` - Produs după ID
- `GET /api/products/category-slug/:slug` - Produse din categorie
- `GET /api/browse/products` - Filtrare avansată

### Taxonomii
- `GET /api/taxonomies/ingredients` - Ingrediente
- `GET /api/taxonomies/flags` - Flaguri
- `GET /api/taxonomies/dough-types` - Tipuri de aluat
- `GET /api/taxonomies/size-options` - Mărimi

## 🔍 Filtrare avansată

Endpoint-ul `/api/browse/products` suportă:

- **Categorie**: `categorySlug=pizza-clasice`
- **Căutare**: `search=margherita`
- **Preț**: `priceMin=20&priceMax=50`
- **Flaguri**: `flags=vegetarian,picant`
- **Ingrediente**: `ingredients=mozzarella,salam`
- **Variante**: `dough=clasic&size=medie`
- **Paginare**: `page=1&limit=12`
- **Sortare**: `sort=price&order=asc`

## 🗄️ Schema bazei de date

```sql
-- Categorii de pizza
Category (id, slug, name, description)

-- Produse pizza cu relații
Product (id, name, description, basePrice, minPrice, maxPrice, categoryId, ...)

-- Taxonomii
Flag (id, key, label)           -- vegetarian, picant, premium
Ingredient (id, key, label)      -- mozzarella, salam, ciuperci
DoughType (id, key, label)       -- clasic, subtire, gros
SizeOption (id, key, label)      -- mica, medie, mare, familie

-- Relații many-to-many
ProductFlag (productId, flagId)
ProductIngredient (productId, ingredientId)

-- Variante de produse
ProductVariant (id, productId, price, doughId, sizeId, sku)
```

## 🎯 Endpoint-uri eliminate (administrative)

Pentru a menține API-ul curat pentru client, au fost eliminate:

- ❌ `POST /categories` - Creare categorii
- ❌ `PUT /categories/:id` - Actualizare categorii
- ❌ `DELETE /categories/:id` - Ștergere categorii
- ❌ `POST /products` - Creare produse
- ❌ `PUT /products/:id` - Actualizare produse
- ❌ `DELETE /products/:id` - Ștergere produse
- ❌ Toate endpoint-urile CRUD pentru taxonomii

## 🔧 Configurare

### Variabile de mediu (.env)

```env
DATABASE_URL="mysql://user:password@localhost:3306/pizza_shop"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
CLIENT_ORIGIN="http://localhost:5173"
```

## 📈 Statistici

- **4 categorii** de pizza
- **6 produse** principale
- **20+ ingrediente** disponibile
- **8 flaguri** pentru filtrare
- **5 tipuri de aluat**
- **4 mărimi** diferite
- **24+ variante** de produse

## 🚀 Deployment

```bash
# Build pentru producție
npm run build

# Rulare în producție
npm start
```

Aplicația este gata pentru utilizare ca magazin de pizza! 🍕