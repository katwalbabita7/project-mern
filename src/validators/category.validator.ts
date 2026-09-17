import { z } from "zod";
import { Request, Response, NextFunction } from 'express';
import { validate } from "../middlewares/validator.middleware";

// MongoDB ID validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID");

const parentCategorySchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine(
    (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
    "Invalid Category ID"
  )
  .transform((val) => (val ? val : null));

// Create Category Schema
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters"),
    description: z.string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    parentCategory: parentCategorySchema,
    isActive: z
      .preprocess((val) => {
        if (val === "true" || val === true) return true;
        if (val === "false" || val === false) return false;
        return val;
      }, z.boolean())
      .optional(),
  }).passthrough(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Get All Categories Schema
export const getAllCategoriesSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? Number(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? Number(val) : 10)),
    search: z.string().trim().optional(),
    parent: mongoIdSchema.optional(),
    isActive: z.string().optional(),
  }).passthrough(),
});

// Get Single Category
export const getCategorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Update Category Schema
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters")
      .optional(),
    description: z.string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    parentCategory: parentCategorySchema,
    isActive: z
      .preprocess((val) => {
        if (val === "true" || val === true) return true;
        if (val === "false" || val === false) return false;
        return val;
      }, z.boolean())
      .optional(),
  }).passthrough().optional(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Delete Category
export const deleteCategorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Export Validators
export const validateCreateCategory = validate(createCategorySchema);
export const validateGetAllCategories = validate(getAllCategoriesSchema);
export const validateGetCategory = validate(getCategorySchema);
export const validateUpdateCategory = validate(updateCategorySchema);
export const validateDeleteCategory = validate(deleteCategorySchema);