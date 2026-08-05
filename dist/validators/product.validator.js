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
            .min(3, "Product name must be at least 3 characters")
            .max(150, "Product name cannot exceed 150 characters"),
        price: zod_1.z.number()
            .positive("Price must be greater than 0"),
        description: zod_1.z.string()
            .min(10, "Description must be at least 10 characters")
            .max(2000, "Description cannot exceed 2000 characters")
            .optional(),
        category: mongoIdSchema,
        brand: mongoIdSchema.optional(),
        stock: zod_1.z.number()
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative")
            .default(0),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(3, "Product name must be at least 3 characters")
            .max(150, "Product name cannot exceed 150 characters")
            .optional(),
        price: zod_1.z.number().positive("Price must be greater than 0").optional(),
        description: zod_1.z.string()
            .min(10, "Description must be at least 10 characters")
            .max(2000, "Description cannot exceed 2000 characters")
            .optional(),
        category: mongoIdSchema.optional(),
        brand: mongoIdSchema.optional(),
        stock: zod_1.z.number().int().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
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
    }),
});
// Export Validators
exports.validateCreateProduct = (0, validator_middleware_1.validate)(exports.createProductSchema);
exports.validateUpdateProduct = (0, validator_middleware_1.validate)(exports.updateProductSchema);
exports.validateProductId = (0, validator_middleware_1.validate)(exports.productIdSchema);
exports.validateGetProductsByBrand = (0, validator_middleware_1.validate)(exports.getProductsByBrandSchema);
exports.validateGetAllProducts = (0, validator_middleware_1.validate)(exports.getAllProductsSchema);
