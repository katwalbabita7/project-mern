"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const uploadFolder = "/categories";
// CREATE CATEGORY
exports.createCategory = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { name, description, parentCategory } = req.body;
    const file = req.file;
    // Check duplicate name
    const existingCategory = await category_model_1.default.findOne({ name: name.trim() });
    if (existingCategory) {
        throw new apiError_utils_1.ApiError(`Category with name "${name}" already exists`, 409);
    }
    const newCategory = new category_model_1.default({
        name,
        description,
        parentCategory
    });
    // Upload image if provided
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        newCategory.image = { path, publicId: public_id };
    }
    await newCategory.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: newCategory,
        message: "Category created successfully",
        statusCode: 201,
    });
});
// GET ALL CATEGORIES
exports.getAllCategories = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, parent } = req.query;
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    let query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (parent) {
        query.parentCategory = parent;
    }
    const categories = await category_model_1.default.find(query)
        .populate('parentCategory', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const total = await category_model_1.default.countDocuments(query);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: categories,
        meta: {
            count: categories.length,
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            limit: limitNumber,
        },
        message: "Categories fetched successfully",
        statusCode: 200,
    });
});
// GET SINGLE CATEGORY
exports.getCategory = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const category = await category_model_1.default.findById(req.params.id).populate('parentCategory', 'name');
    if (!category) {
        throw new apiError_utils_1.ApiError('No category found with that ID', 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: category,
        message: "Category fetched successfully",
        statusCode: 200,
    });
});
// UPDATE CATEGORY
exports.updateCategory = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { name, description, parentCategory, isActive } = req.body;
    const file = req.file;
    const category = await category_model_1.default.findById(req.params.id);
    if (!category) {
        throw new apiError_utils_1.ApiError('Category not found', 404);
    }
    // Name update with duplicate check
    if (name && name !== category.name) {
        const existing = await category_model_1.default.findOne({ name: name.trim() });
        if (existing) {
            throw new apiError_utils_1.ApiError(`Category with name "${name}" already exists`, 409);
        }
        category.name = name;
    }
    if (description !== undefined)
        category.description = description;
    if (parentCategory !== undefined)
        category.parentCategory = parentCategory;
    if (isActive !== undefined)
        category.isActive = isActive;
    // Image update
    if (file) {
        if (category.image?.publicId) {
            await (0, cloudinary_utils_1.deleteFromCloudinary)(category.image.publicId);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        category.image = { path, publicId: public_id };
    }
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: category,
        message: "Category updated successfully",
        statusCode: 200,
    });
});
// DELETE CATEGORY
exports.deleteCategory = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const category = await category_model_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new apiError_utils_1.ApiError('Category not found', 404);
    }
    // Delete image from Cloudinary
    if (category.image?.publicId) {
        await (0, cloudinary_utils_1.deleteFromCloudinary)(category.image.publicId).catch(console.error);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Category deleted successfully",
        statusCode: 200,
    });
});
