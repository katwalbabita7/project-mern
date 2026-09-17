import { z } from "zod";
import { validate } from "../middlewares/validator.middleware";

// MongoDB ObjectId Validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

// SCHEMAS

export const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Product name must be at least 2 characters")
      .max(150, "Product name cannot exceed 150 characters"),

    price: z.coerce.number()
      .positive("Price must be greater than 0"),

    discountPrice: z.coerce.number().min(0).optional().nullable(),

    description: z.string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional()
      .nullable()
      .or(z.literal("")),

    category: mongoIdSchema,
    brand: mongoIdSchema.optional(),

    stock: z.coerce.number()
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .default(0),

    sku: z.string().trim().optional().nullable().or(z.literal("")),
    tags: z.any().optional(),
    isActive: z.any().optional(),
    new_arrival: z.any().optional(),
    is_feature: z.any().optional(),
  }).passthrough(),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(150, "Product name cannot exceed 150 characters")
      .optional(),

    price: z.coerce.number().positive("Price must be greater than 0").optional(),

    discountPrice: z.coerce.number().min(0).optional().nullable(),

    description: z.string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional()
      .nullable()
      .or(z.literal("")),

    category: mongoIdSchema.optional(),
    brand: mongoIdSchema.optional(),

    stock: z.coerce.number().int().min(0).optional(),

    sku: z.string().trim().optional().nullable().or(z.literal("")),

    tags: z.any().optional(),
    isActive: z.any().optional(),
    new_arrival: z.any().optional(),
    is_feature: z.any().optional(),
  }).passthrough(), // ← removed .optional() from the whole body

  params: z.object({
    id: mongoIdSchema,
  }),
});

// ID Validation (used in get, update, delete)
export const productIdSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

// Get Products by Brand
export const getProductsByBrandSchema = z.object({
  params: z.object({
    brand: mongoIdSchema,
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }).optional(),
});

// Get All Products with filters
export const getAllProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("12"),
    search: z.string().trim().optional(),
    category: mongoIdSchema.optional(),
    brand: mongoIdSchema.optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    isActive: z.string().optional(),
  }).passthrough(),
});


// Export Validators
export const validateCreateProduct = validate(createProductSchema);
export const validateUpdateProduct = validate(updateProductSchema);
export const validateProductId = validate(productIdSchema);
export const validateGetProductsByBrand = validate(getProductsByBrandSchema);
export const validateGetAllProducts = validate(getAllProductsSchema);