"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrand = exports.getAllBrands = exports.createBrand = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const uploadFolder = "/brands";
// CREATE BRAND 
exports.createBrand = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file; // ← यो undefined हुन सक्छ
    // Check for duplicate name
    const existingBrand = await brand_model_1.default.findOne({ name: name.trim() });
    if (existingBrand) {
        throw new apiError_utils_1.ApiError(`Brand with name "${name}" already exists`, 409);
    }
    const newBrand = new brand_model_1.default({
        name: name.trim(),
        description: typeof description === 'string' ? description.trim() : '',
        isActive: req.body.isActive !== undefined ? (req.body.isActive === true || String(req.body.isActive) === "true") : true,
    });
    // Upload logo only if file exists
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        newBrand.logo = { path, publicId: public_id };
    }
    await newBrand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: newBrand,
        message: "Brand created successfully",
        statusCode: 201,
    });
});
// GET ALL BRANDS 
exports.getAllBrands = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
    let query = {};
    if (!isAdmin) {
        query.isActive = true;
    }
    else if (req.query.isActive !== undefined) {
        query.isActive = String(req.query.isActive) === 'true';
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const brands = await brand_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const total = await brand_model_1.default.countDocuments(query);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: brands,
        meta: {
            count: brands.length,
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            limit: limitNumber,
        },
        message: "Brands fetched successfully",
        statusCode: 200,
    });
});
// GET SINGLE BRAND 
exports.getBrand = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
    const query = { _id: req.params.id };
    if (!isAdmin) {
        query.isActive = true;
    }
    const brand = await brand_model_1.default.findOne(query);
    if (!brand) {
        throw new apiError_utils_1.ApiError('No brand found with that ID', 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: brand,
        message: "Brand fetched successfully",
        statusCode: 200,
    });
});
// UPDATE BRAND 
exports.updateBrand = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    const brand = await brand_model_1.default.findById(req.params.id);
    if (!brand) {
        throw new apiError_utils_1.ApiError('Brand not found', 404);
    }
    // Name update with duplicate check
    if (name && name.trim() !== brand.name) {
        const existing = await brand_model_1.default.findOne({ name: name.trim() });
        if (existing) {
            throw new apiError_utils_1.ApiError(`Brand with name "${name}" already exists`, 409);
        }
        brand.name = name.trim();
    }
    // Description update
    if (description !== undefined) {
        brand.description = typeof description === 'string' ? description.trim() : '';
    }
    // Status update
    if (req.body.isActive !== undefined) {
        brand.isActive = req.body.isActive === true || String(req.body.isActive) === "true";
    }
    // Logo update - only if file is provided
    if (file) {
        if (brand.logo?.publicId) {
            await (0, cloudinary_utils_1.deleteFromCloudinary)(brand.logo.publicId).catch(console.error);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        brand.logo = { path, publicId: public_id };
    }
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: brand,
        message: "Brand updated successfully",
        statusCode: 200,
    });
});
// DELETE BRAND
exports.deleteBrand = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const brand = await brand_model_1.default.findByIdAndDelete(req.params.id);
    if (!brand) {
        throw new apiError_utils_1.ApiError('Brand not found', 404);
    }
    // Delete logo from Cloudinary if exists
    if (brand.logo?.publicId) {
        await (0, cloudinary_utils_1.deleteFromCloudinary)(brand.logo.publicId).catch(console.error);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand deleted successfully",
        statusCode: 200,
    });
});
