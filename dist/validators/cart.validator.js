"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRemoveFromCart = exports.validateUpdateCartItem = exports.validateAddToCart = exports.removeFromCartSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const validator_middleware_1 = require("../middlewares/validator.middleware");
const zod_1 = require("zod");
// MongoDB ID validation
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");
// Add to Cart Schema
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: mongoIdSchema,
        quantity: zod_1.z.string()
            .optional()
            .transform((val) => (val ? Number(val) : 1))
            .pipe(zod_1.z.number().min(1, "Quantity must be at least 1")),
        variant: zod_1.z.string()
            .trim()
            .max(100, "Variant cannot exceed 100 characters")
            .optional()
            .nullable(),
        price: zod_1.z.number()
            .min(0, "Price cannot be negative")
            .optional(), // Frontend le pathauna recommended
    }),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Update Cart Item Schema
exports.updateCartItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.string()
            .transform((val) => (val ? Number(val) : 1))
            .pipe(zod_1.z.number().min(0, "Quantity must be 0 or greater")),
        variant: zod_1.z.string().trim().optional().nullable(),
    }),
    params: zod_1.z.object({
        productId: mongoIdSchema,
    }),
    query: zod_1.z.object({}).optional(),
});
// Remove from Cart Schema
exports.removeFromCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        variant: zod_1.z.string().trim().optional().nullable(),
    }).optional(),
    params: zod_1.z.object({
        productId: mongoIdSchema,
    }),
    query: zod_1.z.object({}).optional(),
});
// Export validators
exports.validateAddToCart = (0, validator_middleware_1.validate)(exports.addToCartSchema);
exports.validateUpdateCartItem = (0, validator_middleware_1.validate)(exports.updateCartItemSchema);
exports.validateRemoveFromCart = (0, validator_middleware_1.validate)(exports.removeFromCartSchema);
