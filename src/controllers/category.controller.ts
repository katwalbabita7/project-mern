import { Request, Response } from 'express';
import Category from '../models/category.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';
import { deleteFromCloudinary, upload } from '../utils/cloudinary.utils';

const uploadFolder = "/categories";

// CREATE CATEGORY
export const createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, description, parentCategory } = req.body;
    const file = req.file;

    // Check duplicate name
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
        throw new ApiError(`Category with name "${name}" already exists`, 409);
    }

    const newCategory = new Category({ 
        name, 
        description,
        parentCategory 
    });

    // Upload image if provided
    if (file) {
        const { path, public_id } = await upload(file, uploadFolder);
        newCategory.image = { path, publicId: public_id };
    }

    await newCategory.save();

    sendResponse(res, {
        data: newCategory,
        message: "Category created successfully",
        statusCode: 201,
    });
});

// GET ALL CATEGORIES
export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, parent } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));

    let query: any = {};

    if (search) {
        query.name = { $regex: search as string, $options: 'i' };
    }
    if (parent) {
        query.parentCategory = parent;
    }

    const categories = await Category.find(query)
        .populate('parentCategory', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const total = await Category.countDocuments(query);

    sendResponse(res, {
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
export const getCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name');

    if (!category) {
        throw new ApiError('No category found with that ID', 404);
    }

    sendResponse(res, {
        data: category,
        message: "Category fetched successfully",
        statusCode: 200,
    });
});

// UPDATE CATEGORY
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, description, parentCategory, isActive } = req.body;
    const file = req.file;

    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new ApiError('Category not found', 404);
    }

    // Name update with duplicate check
    if (name && name !== category.name) {
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            throw new ApiError(`Category with name "${name}" already exists`, 409);
        }
        category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;
    if (isActive !== undefined) category.isActive = isActive;

    // Image update
    if (file) {
        if (category.image?.publicId) {
            await deleteFromCloudinary(category.image.publicId);
        }
        const { path, public_id } = await upload(file, uploadFolder);
        category.image = { path, publicId: public_id };
    }

    await category.save();

    sendResponse(res, {
        data: category,
        message: "Category updated successfully",
        statusCode: 200,
    });
});

// DELETE CATEGORY
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        throw new ApiError('Category not found', 404);
    }

    // Delete image from Cloudinary
    if (category.image?.publicId) {
        await deleteFromCloudinary(category.image.publicId).catch(console.error);
    }

    sendResponse(res, {
        message: "Category deleted successfully",
        statusCode: 200,
    });
});