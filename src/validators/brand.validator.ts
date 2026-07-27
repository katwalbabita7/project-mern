import {validate} from '../middlewares/validator.middleware';
import { z } from "zod";

// MongoDB ID validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Brand ID");

// Create Brand Schema
export const createBrandSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, "Brand name must be at least 2 characters")
      .max(100, "Brand name cannot exceed 100 characters"),
    description: z.string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .nullable(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Get All Brands Schema
export const getAllBrandsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? Number(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? Number(val) : 10)),
    search: z.string().trim().optional(),
  }),
});

// Get Single Brand
export const getBrandSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Update Brand Schema
export const updateBrandSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, "Brand name must be at least 2 characters")
      .max(100, "Brand name cannot exceed 100 characters")
      .optional(),
    description: z.string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .nullable(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name or description) must be provided",
  }),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Delete Brand
export const deleteBrandSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}).optional(),
});

// Export validators
export const validateCreateBrand = validate(createBrandSchema);
export const validateGetAllBrands = validate(getAllBrandsSchema);
export const validateGetBrand = validate(getBrandSchema);
export const validateUpdateBrand = validate(updateBrandSchema);
export const validateDeleteBrand = validate(deleteBrandSchema);