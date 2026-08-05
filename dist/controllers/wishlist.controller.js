"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getMyWishlist = void 0;
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
// GET MY WISHLIST
exports.getMyWishlist = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id; // from auth middleware
    const wishlist = await wishlist_model_1.default.findOne({ user: userId })
        .populate({
        path: 'products',
        select: 'name price images slug brand category', // जे fields चाहिन्छ ती राख्नु
        populate: [
            { path: 'brand', select: 'name' },
            { path: 'category', select: 'name' }
        ]
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: wishlist?.products || [],
        message: "Wishlist fetched successfully",
        statusCode: 200,
    });
});
// ADD TO WISHLIST
exports.addToWishlist = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.body;
    let wishlist = await wishlist_model_1.default.findOne({ user: userId });
    if (!wishlist) {
        wishlist = new wishlist_model_1.default({ user: userId, products: [] });
    }
    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
        throw new apiError_utils_1.ApiError("Product already in wishlist", 400);
    }
    wishlist.products.push(productId);
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to wishlist",
        statusCode: 200,
    });
});
// REMOVE FROM WISHLIST
exports.removeFromWishlist = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.body;
    const wishlist = await wishlist_model_1.default.findOne({ user: userId });
    if (!wishlist) {
        throw new apiError_utils_1.ApiError("Wishlist not found", 404);
    }
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product removed from wishlist",
        statusCode: 200,
    });
});
