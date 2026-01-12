import type { components } from '../docs/schema';
/**
 * ProductDetails type from generated OpenAPI schema.
 * Includes description and quantityInCart (when user is authenticated).
 */
export type ProductDetails = components['schemas']['ProductDetails'];
/**
 * Extended ProductDetails with explicit quantityInCart type.
 * Use this when you need to ensure quantityInCart is always present.
 */
export interface ProductDetailsExtended extends ProductDetails {
    quantityInCart?: number | null;
}
//# sourceMappingURL=product-details.d.ts.map