import { z } from "zod";
import { validate } from "../middlewares/validator.middleware";

// MongoDB ObjectId Validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

// SCHEMAS

export const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name cannot exceed 150 characters"),

    price: z.number()
      .positive("Price must be greater than 0"),

    description: z.string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

    category: mongoIdSchema,
    brand: mongoIdSchema.optional(),

    stock: z.number()
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .default(0),

    isActive: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name cannot exceed 150 characters")
      .optional(),

    price: z.number().positive("Price must be greater than 0").optional(),
    
    description: z.string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

    category: mongoIdSchema.optional(),
    brand: mongoIdSchema.optional(),

    stock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
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
  }),
});


// Export Validators
export const validateCreateProduct = validate(createProductSchema);
export const validateUpdateProduct = validate(updateProductSchema);
export const validateProductId = validate(productIdSchema);
export const validateGetProductsByBrand = validate(getProductsByBrandSchema);
export const validateGetAllProducts = validate(getAllProductsSchema);