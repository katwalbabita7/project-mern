"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.getMyCart = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
// CART CONTROLLERS 
// ADD TO CART
exports.addToCart = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { product, quantity = 1, variant } = req.body;
    const userId = req.user?._id || req.user?.id; // Assuming auth middleware sets req.user
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login to add items to cart', 401);
    }
    // Determine price if not sent in request
    let price = req.body.price;
    if (price === undefined || price === null) {
        const prod = await product_model_1.default.findById(product);
        if (!prod) {
            throw new apiError_utils_1.ApiError('Product not found', 404);
        }
        price = prod.discountPrice || prod.price;
    }
    // Get or create cart
    let cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        cart = new cart_model_1.default({ user: userId, items: [] });
    }
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === product &&
        (!variant || item.variant === variant));
    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += Number(quantity);
    }
    else {
        // Add new item
        cart.items.push({
            product,
            quantity: Number(quantity),
            price: Number(price),
            variant
        });
    }
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: cart,
        message: "Item added to cart successfully",
        statusCode: 200,
    });
});
// GET MY CART
exports.getMyCart = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login to view cart', 401);
    }
    const cart = await cart_model_1.default.findOne({ user: userId })
        .populate({
        path: 'items.product',
        select: 'name price images slug' // adjust fields as needed
    });
    if (!cart) {
        // Return empty cart structure
        return (0, sendResponse_utils_1.sendResponse)(res, {
            data: { items: [], totalAmount: 0 },
            message: "Cart is empty",
            statusCode: 200,
        });
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: cart,
        message: "Cart fetched successfully",
        statusCode: 200,
    });
});
// UPDATE CART ITEM QUANTITY
exports.updateCartItem = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const { quantity, variant } = req.body;
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login', 401);
    }
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new apiError_utils_1.ApiError('Cart not found', 404);
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId &&
        (!variant || item.variant === variant));
    if (itemIndex === -1) {
        throw new apiError_utils_1.ApiError('Item not found in cart', 404);
    }
    if (quantity < 1) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
    }
    else {
        cart.items[itemIndex].quantity = Number(quantity);
    }
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: cart,
        message: "Cart updated successfully",
        statusCode: 200,
    });
});
// REMOVE ITEM FROM CART
exports.removeFromCart = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const { variant } = req.body;
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login', 401);
    }
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new apiError_utils_1.ApiError('Cart not found', 404);
    }
    cart.items = cart.items.filter(item => !(item.product.toString() === productId &&
        (!variant || item.variant === variant)));
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: cart,
        message: "Item removed from cart successfully",
        statusCode: 200,
    });
});
// CLEAR CART
exports.clearCart = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login', 401);
    }
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart cleared successfully",
        statusCode: 200,
    });
});
