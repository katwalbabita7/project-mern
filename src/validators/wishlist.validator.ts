import { z } from "zod";
import { validate } from "../middlewares/validator.middleware";

const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

// Add to Wishlist
export const addToWishlistSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Remove from Wishlist
export const removeFromWishlistSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Get Wishlist (no body needed)
export const getWishlistSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});


export const validateAddToWishlist = validate(addToWishlistSchema);
export const validateRemoveFromWishlist = validate(removeFromWishlistSchema);
export const validateGetWishlist = validate(getWishlistSchema);