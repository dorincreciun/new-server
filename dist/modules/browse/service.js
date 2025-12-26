"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseService = exports.BrowseService = void 0;
const client_1 = __importDefault(require("../../shared/prisma/client"));
class BrowseService {
    async getProducts(query) {
        const { q, categorySlug, page, limit, sort, order } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (categorySlug) {
            where.category = { slug: categorySlug };
        }
        if (q) {
            where.OR = [
                { name: { contains: q } },
                { description: { contains: q } },
            ];
        }
        let orderBy = {};
        if (sort === 'price')
            orderBy = { minPrice: order };
        else if (sort === 'rating')
            orderBy = { ratingAverage: order };
        else if (sort === 'popularity')
            orderBy = { popularity: order };
        else if (sort === 'newest')
            orderBy = { createdAt: order };
        const [products, total] = await Promise.all([
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
        ]);
        const formattedProducts = products.map((p) => ({
            ...p,
            basePrice: Number(p.basePrice),
            minPrice: p.minPrice ? Number(p.minPrice) : null,
            maxPrice: p.maxPrice ? Number(p.maxPrice) : null,
            ratingAverage: p.ratingAverage ? Number(p.ratingAverage) : null,
            flags: p.flags.map((f) => f.flag),
            ingredients: p.ingredients.map((i) => i.ingredient),
            variants: p.variants.map((v) => ({
                ...v,
                price: Number(v.price),
                doughType: v.dough,
                sizeOption: v.size,
            })),
        }));
        return {
            products: formattedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getFilters(query) {
        const { categorySlug } = query;
        const where = {};
        if (categorySlug) {
            where.category = { slug: categorySlug };
        }
        // Agregări performante
        const [priceRange, categoriesWithCounts] = await Promise.all([
            client_1.default.product.aggregate({
                where,
                _min: { minPrice: true },
                _max: { maxPrice: true },
            }),
            client_1.default.category.findMany({
                include: {
                    _count: {
                        select: { products: { where } }
                    }
                }
            })
        ]);
        return {
            price: {
                min: Number(priceRange._min.minPrice || 0),
                max: Number(priceRange._max.maxPrice || 0),
            },
            categories: categoriesWithCounts.map(c => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                count: c._count.products,
            })).filter(c => c.count > 0),
        };
    }
}
exports.BrowseService = BrowseService;
exports.browseService = new BrowseService();
//# sourceMappingURL=service.js.map