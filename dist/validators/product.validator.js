"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetAllProducts = exports.validateGetProductsByBrand = exports.validateProductId = exports.validateUpdateProduct = exports.validateCreateProduct = exports.getAllProductsSchema = exports.getProductsByBrandSchema = exports.productIdSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const validator_middleware_1 = require("../middlewares/validator.middleware");
// MongoDB ObjectId Validation
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");
// SCHEMAS
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, "Product name must be at least 2 characters")
            .max(150, "Product name cannot exceed 150 characters"),
        price: zod_1.z.coerce.number()
            .positive("Price must be greater than 0"),
        discountPrice: zod_1.z.coerce.number().min(0).optional().nullable(),
        description: zod_1.z.string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters")
            .optional()
            .nullable()
            .or(zod_1.z.literal("")),
        category: mongoIdSchema,
        brand: mongoIdSchema.optional(),
        stock: zod_1.z.coerce.number()
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative")
            .default(0),
        sku: zod_1.z.string().trim().optional().nullable().or(zod_1.z.literal("")),
        tags: zod_1.z.any().optional(),
        isActive: zod_1.z.any().optional(),
        new_arrival: zod_1.z.any().optional(),
        is_feature: zod_1.z.any().optional(),
    }).passthrough(),
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .trim()
            .min(2, "Product name must be at least 2 characters")
            .max(150, "Product name cannot exceed 150 characters")
            .optional(),
        price: zod_1.z.coerce.number().positive("Price must be greater than 0").optional(),
        discountPrice: zod_1.z.coerce.number().min(0).optional().nullable(),
        description: zod_1.z.string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters")
            .optional()
            .nullable()
            .or(zod_1.z.literal("")),
        category: mongoIdSchema.optional(),
        brand: mongoIdSchema.optional(),
        stock: zod_1.z.coerce.number().int().min(0).optional(),
        sku: zod_1.z.string().trim().optional().nullable().or(zod_1.z.literal("")),
        tags: zod_1.z.any().optional(),
        isActive: zod_1.z.any().optional(),
        new_arrival: zod_1.z.any().optional(),
        is_feature: zod_1.z.any().optional(),
    }).passthrough(), // ← removed .optional() from the whole body
    params: zod_1.z.object({
        id: mongoIdSchema,
    }),
});
// ID Validation (used in get, update, delete)
exports.productIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: mongoIdSchema,
    }),
});
// Get Products by Brand
exports.getProductsByBrandSchema = zod_1.z.object({
    params: zod_1.z.object({
        brand: mongoIdSchema,
    }),
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }).optional(),
});
// Get All Products with filters
exports.getAllProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().default("1"),
        limit: zod_1.z.string().optional().default("12"),
        search: zod_1.z.string().trim().optional(),
        category: mongoIdSchema.optional(),
        brand: mongoIdSchema.optional(),
        minPrice: zod_1.z.string().optional(),
        maxPrice: zod_1.z.string().optional(),
        isActive: zod_1.z.string().optional(),
    }).passthrough(),
});
// Export Validators
exports.validateCreateProduct = (0, validator_middleware_1.validate)(exports.createProductSchema);
exports.validateUpdateProduct = (0, validator_middleware_1.validate)(exports.updateProductSchema);
exports.validateProductId = (0, validator_middleware_1.validate)(exports.productIdSchema);
exports.validateGetProductsByBrand = (0, validator_middleware_1.validate)(exports.getProductsByBrandSchema);
exports.validateGetAllProducts = (0, validator_middleware_1.validate)(exports.getAllProductsSchema);
