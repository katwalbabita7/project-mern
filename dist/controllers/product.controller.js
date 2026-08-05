"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getNewArrivals = exports.getFeaturedProducts = exports.getProductsByBrand = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const product_validator_1 = require("../validators/product.validator");
const uploadFolder = "products";
//* CREATE PRODUCT (Multiple Images)
exports.createProduct = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const validatedData = product_validator_1.createProductSchema.parse(req.body);
    const files = req.files; // ← Multiple files
    const product = new product_model_1.default(validatedData);
    // Handle Multiple Image Upload
    if (files && files.length > 0) {
        const imageArray = [];
        for (const file of files) {
            try {
                const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            }
            catch (error) {
                console.error("Image upload failed for one file:", error);
                // Continue with other images
            }
        }
        product.images = imageArray;
    }
    const savedProduct = await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: savedProduct,
        message: 'Product created successfully',
        statusCode: 201,
    });
});
//* UPDATE PRODUCT (Multiple Images)
exports.updateProduct = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const validatedData = product_validator_1.updateProductSchema.parse(req.body);
    const files = req.files;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        throw new apiError_utils_1.ApiError('Product not found', 404);
    }
    // Update normal fields
    Object.assign(product, validatedData);
    // Handle Multiple Image Update
    if (files && files.length > 0) {
        try {
            // Delete old images from Cloudinary
            if (product.images && product.images.length > 0) {
                for (const img of product.images) {
                    if (img.publicId) {
                        await (0, cloudinary_utils_1.deleteFromCloudinary)(img.publicId);
                    }
                }
            }
            // Upload new images
            const imageArray = [];
            for (const file of files) {
                const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            }
            product.images = imageArray;
        }
        catch (error) {
            console.error("Image update error:", error);
            throw new apiError_utils_1.ApiError("Failed to update product images", 500);
        }
    }
    const updatedProduct = await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: updatedProduct,
        message: 'Product updated successfully',
        statusCode: 200,
    });
});
//* GET ALL PRODUCTS
exports.getAllProducts = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { category, search, page = 1, limit = 10 } = req.query;
    // Query building
    const query = { isActive: true };
    if (category) {
        query.category = category;
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit))); // limit cap
    const skip = (pageNumber - 1) * limitNumber;
    // Get products
    const products = await product_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(); // Optional: faster response
    // Get total count
    const total = await product_model_1.default.countDocuments(query);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: products,
        meta: {
            count: products.length,
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            limit: limitNumber,
        },
        message: 'Products fetched successfully',
        statusCode: 200,
    });
});
//* GET PRODUCT BY ID
exports.getProductById = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const product = await product_model_1.default.findById(req.params.id);
    if (!product) {
        throw new apiError_utils_1.ApiError('Product not found', 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: product,
        message: 'Product fetched successfully',
        statusCode: 200,
    });
});
//* GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!category) {
        throw new apiError_utils_1.ApiError('Category is required', 400);
    }
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const query = { category, isActive: true };
    const products = await product_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const total = await product_model_1.default.countDocuments(query);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: products,
        meta: {
            count: products.length,
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            limit: limitNumber,
        },
        message: 'Products by category fetched successfully',
        statusCode: 200,
    });
});
//* GET PRODUCTS BY BRAND
exports.getProductsByBrand = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { brand } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!brand) {
        throw new apiError_utils_1.ApiError('Brand is required', 400);
    }
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const query = { brand, isActive: true };
    const products = await product_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const total = await product_model_1.default.countDocuments(query);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: products,
        meta: {
            count: products.length,
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            limit: limitNumber,
        },
        message: 'Products by brand fetched successfully',
        statusCode: 200,
    });
});
//* GET FEATURED PRODUCTS
exports.getFeaturedProducts = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const limit = Math.min(20, Number(req.query.limit) || 8); // safe limit
    const products = await product_model_1.default.find({ isActive: true })
        .sort({ averageRating: -1, createdAt: -1 })
        .limit(limit);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: products,
        message: 'Featured products fetched successfully',
        statusCode: 200,
    });
});
//* GET NEW ARRIVALS
exports.getNewArrivals = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const limit = Math.min(20, Number(req.query.limit) || 10);
    const products = await product_model_1.default.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: products,
        message: 'New arrivals fetched successfully',
        statusCode: 200,
    });
});
//* DELETE PRODUCT
exports.deleteProduct = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const product = await product_model_1.default.findByIdAndDelete(req.params.id);
    if (!product) {
        throw new apiError_utils_1.ApiError('Product not found', 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Product deleted successfully',
        statusCode: 200,
    });
});
