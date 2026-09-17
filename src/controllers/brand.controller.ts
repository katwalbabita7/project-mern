import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';
import { deleteFromCloudinary, upload } from '../utils/cloudinary.utils';

// Import Validators
import {
  createBrandSchema,
  validateGetAllBrands,
  validateGetBrand,
  validateUpdateBrand,
  validateDeleteBrand,
} from '../validators/brand.validator';   // adjust path if needed

const uploadFolder = "/brands";

// CREATE BRAND 
export const createBrand = catchAsync(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const file = req.file;   // ← यो undefined हुन सक्छ

    // Check for duplicate name
    const existingBrand = await Brand.findOne({ name: name.trim() });
    if (existingBrand) {
        throw new ApiError(`Brand with name "${name}" already exists`, 409);
    }

    const newBrand = new Brand({ 
        name: name.trim(), 
        description: typeof description === 'string' ? description.trim() : '',
        isActive: req.body.isActive !== undefined ? (req.body.isActive === true || String(req.body.isActive) === "true") : true,
    });

    // Upload logo only if file exists
    if (file) {
        const { path, public_id } = await upload(file, uploadFolder);
        newBrand.logo = { path, publicId: public_id };
    } 

    await newBrand.save();

    sendResponse(res, {
        data: newBrand,
        message: "Brand created successfully",
        statusCode: 201,
    });
});

// GET ALL BRANDS 
export const getAllBrands = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query;

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

    const brands = await Brand.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const total = await Brand.countDocuments(query);

    sendResponse(res, {
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
export const getBrand = catchAsync(async (req: Request, res: Response) => {
    const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
    const query: any = { _id: req.params.id };
    if (!isAdmin) {
        query.isActive = true;
    }

    const brand = await Brand.findOne(query);

    if (!brand) {
        throw new ApiError('No brand found with that ID', 404);
    }

    sendResponse(res, {
        data: brand,
        message: "Brand fetched successfully",
        statusCode: 200,
    });
});

// UPDATE BRAND 
export const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const file = req.file;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new ApiError('Brand not found', 404);
    }

    // Name update with duplicate check
    if (name && name.trim() !== brand.name) {
        const existing = await Brand.findOne({ name: name.trim() });
        if (existing) {
            throw new ApiError(`Brand with name "${name}" already exists`, 409);
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
            await deleteFromCloudinary(brand.logo.publicId).catch(console.error);
        }

        const { path, public_id } = await upload(file, uploadFolder);
        brand.logo = { path, publicId: public_id };
    }

    await brand.save();

    sendResponse(res, {
        data: brand,
        message: "Brand updated successfully",
        statusCode: 200,
    });
});
// DELETE BRAND
export const deleteBrand = catchAsync(async (req: Request, res: Response) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
        throw new ApiError('Brand not found', 404);
    }

    // Delete logo from Cloudinary if exists
    if (brand.logo?.publicId) {
        await deleteFromCloudinary(brand.logo.publicId).catch(console.error);
    }

    sendResponse(res, {
        message: "Brand deleted successfully",
        statusCode: 200,
    });
});