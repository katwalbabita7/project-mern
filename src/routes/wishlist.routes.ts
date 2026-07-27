import express from "express";

import {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller";

import { authenticate } from "../middlewares/auth.middleware";
import {
    validateAddToWishlist,
    validateRemoveFromWishlist,
    validateGetWishlist,
} from "../validators/wishlist.validator";

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate());   // User must be logged in

// Get My Wishlist
router.get("/", validateGetWishlist, getMyWishlist);

// Add to Wishlist
router.post("/add", validateAddToWishlist, addToWishlist);

// Remove from Wishlist
router.post("/remove", validateRemoveFromWishlist, removeFromWishlist);

export default router;