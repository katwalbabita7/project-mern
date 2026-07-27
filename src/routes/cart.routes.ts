import express from "express";

import {
    addToCart,
    getMyCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

// Import Validators
import {
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveFromCart,
} from "../validators/cart.validator";

const router = express.Router();

//CART ROUTES

// Add to Cart
router.post(
    "/add",
    authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
    validateAddToCart,
    addToCart
);

// Get My Cart
router.get(
    "/",
    authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
    getMyCart
);

// Update Cart Item Quantity
router.put(
    "/:productId",
    authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
    validateUpdateCartItem,
    updateCartItem
);

// Remove Item from Cart
router.delete(
    "/:productId",
    authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
    validateRemoveFromCart,
    removeFromCart
);

// Clear Entire Cart
router.delete(
    "/",
    authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
    clearCart
);

export default router;