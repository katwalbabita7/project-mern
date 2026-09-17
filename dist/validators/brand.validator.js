"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteBrand = exports.validateUpdateBrand = exports.validateGetBrand = exports.validateGetAllBrands = exports.validateCreateBrand = exports.deleteBrandSchema = exports.updateBrandSchema = exports.getBrandSchema = exports.getAllBrandsSchema = exports.createBrandSchema = void 0;
const validator_middleware_1 = require("../middlewares/validator.middleware");
const zod_1 = require("zod");
// MongoDB ID validation
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Brand ID");
// Create Brand Schema
exports.createBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .trim()
            .min(2, "Brand name must be at least 2 characters")
            .max(100, "Brand name cannot exceed 100 characters"),
        description: zod_1.z.string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional()
            .nullable()
            .or(zod_1.z.literal("")),
        isActive: zod_1.z
            .preprocess((val) => {
            if (val === "true" || val === true)
                return true;
            if (val === "false" || val === false)
                return false;
            return val;
        }, zod_1.z.boolean())
            .optional(),
    }).passthrough(),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Get All Brands Schema
exports.getAllBrandsSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform((val) => (val ? Number(val) : 1)),
        limit: zod_1.z.string().optional().transform((val) => (val ? Number(val) : 10)),
        search: zod_1.z.string().trim().optional(),
        isActive: zod_1.z.string().optional(),
    }).passthrough(),
});
// Get Single Brand
exports.getBrandSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Update Brand Schema
exports.updateBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .trim()
            .min(2, "Brand name must be at least 2 characters")
            .max(100, "Brand name cannot exceed 100 characters")
            .optional(),
        description: zod_1.z.string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional()
            .nullable()
            .or(zod_1.z.literal("")),
        isActive: zod_1.z
            .preprocess((val) => {
            if (val === "true" || val === true)
                return true;
            if (val === "false" || val === false)
                return false;
            return val;
        }, zod_1.z.boolean())
            .optional(),
    }).passthrough().optional(),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Delete Brand
exports.deleteBrandSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Export validators
exports.validateCreateBrand = (0, validator_middleware_1.validate)(exports.createBrandSchema);
exports.validateGetAllBrands = (0, validator_middleware_1.validate)(exports.getAllBrandsSchema);
exports.validateGetBrand = (0, validator_middleware_1.validate)(exports.getBrandSchema);
exports.validateUpdateBrand = (0, validator_middleware_1.validate)(exports.updateBrandSchema);
exports.validateDeleteBrand = (0, validator_middleware_1.validate)(exports.deleteBrandSchema);
