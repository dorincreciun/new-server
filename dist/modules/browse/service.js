"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseService = exports.BrowseService = void 0;
const client_1 = __importDefault(require("../../shared/prisma/client"));
const formatters_1 = require("../../shared/utils/formatters");
class BrowseService {
    /**
     * Construiește obiectul `where` folosit atât pentru /browse/products,
     * cât și pentru /browse/filters pentru a garanta consistența filtrării.
     */
    buildProductWhere(query) {
        const { q, categorySlug, priceMin, priceMax, flags, ingredients, dough, size, isCustomizable, isNew, } = query;
        const where = { AND: [] };
        if (categorySlug) {
            where.AND.push({ category: { slug: categorySlug } });
        }
        if (q) {
            where.AND.push({
                OR: [{ name: { contains: q } }, { description: { contains: q } }],
            });
        }
        if (priceMin !== undefined) {
            where.AND.push({ minPrice: { gte: priceMin } });
        }
        if (priceMax !== undefined) {
            where.AND.push({ minPrice: { lte: priceMax } });
        }
        if (typeof isCustomizable === 'boolean') {
            where.AND.push({ isCustomizable });
        }
        if (isNew === true) {
            const threshold = new Date();
            threshold.setDate(threshold.getDate() - 30); // 30 zile default
            where.AND.push({ releasedAt: { gte: threshold } });
        }
        if (flags && flags.length > 0) {
            flags.forEach((key) => {
                where.AND.push({ flags: { some: { flag: { key } } } });
            });
        }
        if (ingredients && ingredients.length > 0) {
            ingredients.forEach((key) => {
                where.AND.push({
                    ingredients: { some: { ingredient: { key } } },
                });
            });
        }
        if (dough || size) {
            const variantWhere = {};
            if (dough)
                variantWhere.dough = { key: dough };
            if (size)
                variantWhere.size = { key: size };
            where.AND.push({ variants: { some: variantWhere } });
        }
        return where.AND.length > 0 ? where : {};
    }
    /**
     * Construcție comună a listei de filtre (flags, ingredients, doughTypes, sizeOptions, price)
     * pentru un anumit `where` de produs.
     */
    async buildFilterList(where) {
        const hasFilters = Object.keys(where).length > 0;
        const productRelationWhere = hasFilters ? { product: { is: where } } : {};
        const [priceAgg, allFlags, flagGroups, allIngredients, ingredientGroups, allDoughTypes, doughGroups, allSizeOptions, sizeGroups,] = await Promise.all([
            client_1.default.product.aggregate({
                where,
                _min: { minPrice: true, basePrice: true },
                _max: { maxPrice: true, basePrice: true },
            }),
            client_1.default.flag.findMany({
                select: { id: true, key: true, label: true },
            }),
            client_1.default.productFlag.groupBy({
                by: ['flagId'],
                where: productRelationWhere,
                _count: { productId: true },
            }),
            client_1.default.ingredient.findMany({
                select: { id: true, key: true, label: true },
            }),
            client_1.default.productIngredient.groupBy({
                by: ['ingredientId'],
                where: productRelationWhere,
                _count: { productId: true },
            }),
            client_1.default.doughType.findMany({
                select: { id: true, key: true, label: true },
            }),
            client_1.default.productVariant.groupBy({
                by: ['doughId'],
                where: {
                    ...productRelationWhere,
                    doughId: { not: null },
                },
                _count: { id: true },
            }),
            client_1.default.sizeOption.findMany({
                select: { id: true, key: true, label: true },
            }),
            client_1.default.productVariant.groupBy({
                by: ['sizeId'],
                where: {
                    ...productRelationWhere,
                    sizeId: { not: null },
                },
                _count: { id: true },
            }),
        ]);
        // Dinamic MIN/MAX price pe rezultatele filtrate
        let minPrice = Number.POSITIVE_INFINITY;
        let maxPrice = 0;
        const minCandidates = [priceAgg._min.minPrice, priceAgg._min.basePrice];
        const maxCandidates = [priceAgg._max.maxPrice, priceAgg._max.basePrice];
        minCandidates.forEach((v) => {
            if (v !== null) {
                const n = Number(v);
                if (n < minPrice)
                    minPrice = n;
            }
        });
        maxCandidates.forEach((v) => {
            if (v !== null) {
                const n = Number(v);
                if (n > maxPrice)
                    maxPrice = n;
            }
        });
        if (!Number.isFinite(minPrice)) {
            minPrice = 0;
            maxPrice = 0;
        }
        // Flag-uri cu count dinamic (inclusiv 0)
        const flagCountById = new Map();
        flagGroups.forEach((g) => {
            flagCountById.set(g.flagId, g._count.productId);
        });
        const flagFilters = allFlags.map((f) => ({
            id: f.id,
            key: f.key,
            label: f.label,
            count: flagCountById.get(f.id) ?? 0,
        }));
        // Ingrediente cu count dinamic (inclusiv 0 – ex. "Salam" când e selectat "Vegetarian")
        const ingredientCountById = new Map();
        ingredientGroups.forEach((g) => {
            ingredientCountById.set(g.ingredientId, g._count.productId);
        });
        const ingredientFilters = allIngredients.map((ing) => ({
            id: ing.id,
            key: ing.key,
            label: ing.label,
            count: ingredientCountById.get(ing.id) ?? 0,
        }));
        // Tipuri de aluat (doughTypes) cu count pe variante
        const doughCountById = new Map();
        doughGroups.forEach((g) => {
            if (g.doughId != null) {
                doughCountById.set(g.doughId, g._count.id);
            }
        });
        const doughFilters = allDoughTypes.map((d) => ({
            id: d.id,
            key: d.key,
            label: d.label,
            count: doughCountById.get(d.id) ?? 0,
        }));
        // Mărimi (sizeOptions) cu count pe variante
        const sizeCountById = new Map();
        sizeGroups.forEach((g) => {
            if (g.sizeId != null) {
                sizeCountById.set(g.sizeId, g._count.id);
            }
        });
        const sizeFilters = allSizeOptions.map((s) => ({
            id: s.id,
            key: s.key,
            label: s.label,
            count: sizeCountById.get(s.id) ?? 0,
        }));
        return {
            price: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
            flags: flagFilters,
            ingredients: ingredientFilters,
            doughTypes: doughFilters,
            sizeOptions: sizeFilters,
        };
    }
    /**
     * Endpoint de produse: filtrează după categorie, preț, filtre (flags, ingredients, dough, size),
     * iar dacă nu este specificat nimic, întoarce toate produsele.
     */
    async getProducts(query) {
        const { page, limit, sort, order } = query;
        const skip = (page - 1) * limit;
        const where = this.buildProductWhere(query);
        let orderBy = {};
        if (sort === 'price')
            orderBy = { minPrice: order };
        else if (sort === 'rating')
            orderBy = { ratingAverage: order };
        else if (sort === 'popularity')
            orderBy = { popularity: order };
        else if (sort === 'newest')
            orderBy = { releasedAt: order };
        const [products, total, filters] = await Promise.all([
            client_1.default.product.findMany({
                where,
                include: {
                    category: true,
                    flags: { include: { flag: true } },
                    ingredients: { include: { ingredient: true } },
                    variants: { include: { dough: true, size: true } },
                },
                orderBy,
                skip,
                take: limit,
            }),
            client_1.default.product.count({ where }),
            this.buildFilterList(where),
        ]);
        const formattedProducts = products.map(formatters_1.formatProduct);
        return {
            products: formattedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            filters,
        };
    }
    /**
     * Endpoint de filtre: întoarce toate filtrele posibile (price, flags, ingredients, doughTypes, sizeOptions)
     * pentru produsele care corespund filtrelor primite (în special categoria).
     */
    async getFilters(query) {
        const where = this.buildProductWhere(query);
        return this.buildFilterList(where);
    }
}
exports.BrowseService = BrowseService;
exports.browseService = new BrowseService();
//# sourceMappingURL=service.js.map