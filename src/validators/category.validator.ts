import { z } from "zod";
import { Request, Response, NextFunction } from 'express';
import { validate } from "../middlewares/validator.middleware";

// MongoDB ID validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID");

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
      .nullable(),
    parentCategory: mongoIdSchema.optional().nullable(),
  }),
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
  }),
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
      .nullable(),
    parentCategory: mongoIdSchema.optional().nullable(),
    isActive: z.boolean().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  }),
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