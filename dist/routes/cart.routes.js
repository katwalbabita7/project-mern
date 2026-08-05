"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
// Import Validators
const cart_validator_1 = require("../validators/cart.validator");
const router = express_1.default.Router();
//CART ROUTES
// Add to Cart
router.post("/add", (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), cart_validator_1.validateAddToCart, cart_controller_1.addToCart);
// Get My Cart
router.get("/", (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), cart_controller_1.getMyCart);
// Update Cart Item Quantity
router.put("/:productId", (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), cart_validator_1.validateUpdateCartItem, cart_controller_1.updateCartItem);
// Remove Item from Cart
router.delete("/:productId", (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), cart_validator_1.validateRemoveFromCart, cart_controller_1.removeFromCart);
// Clear Entire Cart
router.delete("/", (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), cart_controller_1.clearCart);
exports.default = router;
