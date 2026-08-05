"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetWishlist = exports.validateRemoveFromWishlist = exports.validateAddToWishlist = exports.getWishlistSchema = exports.removeFromWishlistSchema = exports.addToWishlistSchema = void 0;
const zod_1 = require("zod");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");
// Add to Wishlist
exports.addToWishlistSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: mongoIdSchema,
    }),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Remove from Wishlist
exports.removeFromWishlistSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: mongoIdSchema,
    }),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Get Wishlist (no body needed)
exports.getWishlistSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
exports.validateAddToWishlist = (0, validator_middleware_1.validate)(exports.addToWishlistSchema);
exports.validateRemoveFromWishlist = (0, validator_middleware_1.validate)(exports.removeFromWishlistSchema);
exports.validateGetWishlist = (0, validator_middleware_1.validate)(exports.getWishlistSchema);
