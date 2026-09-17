import { Request, Response } from 'express';
import Category from '../models/category.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';
import { deleteFromCloudinary, upload } from '../utils/cloudinary.utils';

const uploadFolder = "/categories";

// CREATE CATEGORY
export const createCategories = catchAsync(async (req: Request, res: Response) => {
    const { name, description, parentCategory } = req.body;
    const file = req.file;

    // Check duplicate name
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
        throw new ApiError(`Category with name "${name}" already exists`, 409);
    }

    const newCategory = new Category({ 
        name: name.trim(), 
        description: typeof description === 'string' ? description.trim() : '',
        parentCategory: parentCategory ? parentCategory : null,
        isActive: req.body.isActive !== undefined ? (req.body.isActive === true || String(req.body.isActive) === "true") : true,
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

    const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
    let query: any = {};

    if (!isAdmin) {
        query.isActive = true;
    } else if (req.query.isActive !== undefined) {
        query.isActive = String(req.query.isActive) === 'true';
    }

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
export const getCategories = catchAsync(async (req: Request, res: Response) => {
    const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
    const query: any = { _id: req.params.id };
    if (!isAdmin) {
        query.isActive = true;
    }

    const category = await Category.findOne(query).populate('parentCategory', 'name');

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
export const updateCategories = catchAsync(async (req: Request, res: Response) => {
    const { name, description, parentCategory, isActive } = req.body;
    const file = req.file;

    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new ApiError('Category not found', 404);
    }

    // Name update with duplicate check
    if (name && name.trim() !== category.name) {
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            throw new ApiError(`Category with name "${name}" already exists`, 409);
        }
        category.name = name.trim();
    }

    if (description !== undefined) category.description = typeof description === 'string' ? description.trim() : '';
    if (parentCategory !== undefined) category.parentCategory = parentCategory ? parentCategory : null;
    if (isActive !== undefined) category.isActive = isActive === true || String(isActive) === 'true';

    // Image update
    if (file) {
        if (category.image?.publicId) {
            await deleteFromCloudinary(category.image.publicId).catch(console.error);
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
export const deleteCategories = catchAsync(async (req: Request, res: Response) => {
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