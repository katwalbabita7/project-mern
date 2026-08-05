"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteCategory = exports.validateUpdateCategory = exports.validateGetCategory = exports.validateGetAllCategories = exports.validateCreateCategory = exports.deleteCategorySchema = exports.updateCategorySchema = exports.getCategorySchema = exports.getAllCategoriesSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const validator_middleware_1 = require("../middlewares/validator.middleware");
// MongoDB ID validation
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID");
// Create Category Schema
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .trim()
            .min(2, "Category name must be at least 2 characters")
            .max(100, "Category name cannot exceed 100 characters"),
        description: zod_1.z.string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional()
            .nullable(),
        parentCategory: mongoIdSchema.optional().nullable(),
    }),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Get All Categories Schema
exports.getAllCategoriesSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform((val) => (val ? Number(val) : 1)),
        limit: zod_1.z.string().optional().transform((val) => (val ? Number(val) : 10)),
        search: zod_1.z.string().trim().optional(),
        parent: mongoIdSchema.optional(),
    }),
});
// Get Single Category
exports.getCategorySchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Update Category Schema
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .trim()
            .min(2, "Category name must be at least 2 characters")
            .max(100, "Category name cannot exceed 100 characters")
            .optional(),
        description: zod_1.z.string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional()
            .nullable(),
        parentCategory: mongoIdSchema.optional().nullable(),
        isActive: zod_1.z.boolean().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    }),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Delete Category
exports.deleteCategorySchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({ id: mongoIdSchema }),
    query: zod_1.z.object({}).optional(),
});
// Export Validators
exports.validateCreateCategory = (0, validator_middleware_1.validate)(exports.createCategorySchema);
exports.validateGetAllCategories = (0, validator_middleware_1.validate)(exports.getAllCategoriesSchema);
exports.validateGetCategory = (0, validator_middleware_1.validate)(exports.getCategorySchema);
exports.validateUpdateCategory = (0, validator_middleware_1.validate)(exports.updateCategorySchema);
exports.validateDeleteCategory = (0, validator_middleware_1.validate)(exports.deleteCategorySchema);
