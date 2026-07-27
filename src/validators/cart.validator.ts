import { validate } from '../middlewares/validator.middleware';
import { z } from "zod";

// MongoDB ID validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

// Add to Cart Schema
export const addToCartSchema = z.object({
  body: z.object({
    product: mongoIdSchema,
    quantity: z.string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .pipe(z.number().min(1, "Quantity must be at least 1")),
    variant: z.string()
      .trim()
      .max(100, "Variant cannot exceed 100 characters")
      .optional()
      .nullable(),
    price: z.number()
      .min(0, "Price cannot be negative")
      .optional(),   // Frontend le pathauna recommended
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Update Cart Item Schema
export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.string()
      .transform((val) => (val ? Number(val) : 1))
      .pipe(z.number().min(0, "Quantity must be 0 or greater")),
    variant: z.string().trim().optional().nullable(),
  }),
  params: z.object({
    productId: mongoIdSchema,
  }),
  query: z.object({}).optional(),
});

// Remove from Cart Schema
export const removeFromCartSchema = z.object({
  body: z.object({
    variant: z.string().trim().optional().nullable(),
  }).optional(),
  params: z.object({
    productId: mongoIdSchema,
  }),
  query: z.object({}).optional(),
});

// Export validators
export const validateAddToCart = validate(addToCartSchema);
export const validateUpdateCartItem = validate(updateCartItemSchema);
export const validateRemoveFromCart = validate(removeFromCartSchema);