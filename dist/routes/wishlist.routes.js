"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const wishlist_validator_1 = require("../validators/wishlist.validator");
const router = express_1.default.Router();
// All wishlist routes require authentication
router.use((0, auth_middleware_1.authenticate)()); // User must be logged in
// Get My Wishlist
router.get("/", wishlist_validator_1.validateGetWishlist, wishlist_controller_1.getMyWishlist);
// Add to Wishlist
router.post("/add", wishlist_validator_1.validateAddToWishlist, wishlist_controller_1.addToWishlist);
// Remove from Wishlist
router.post("/remove", wishlist_validator_1.validateRemoveFromWishlist, wishlist_controller_1.removeFromWishlist);
exports.default = router;
