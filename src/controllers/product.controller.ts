import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { ApiError } from '../utils/apiError.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { upload, deleteFromCloudinary } from '../utils/cloudinary.utils';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';


const uploadFolder = "products";

//* CREATE PRODUCT (Multiple Images)
export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createProductSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];   // ← Multiple files

    const product = new Product(validatedData);

    // Handle Multiple Image Upload
    if (files && files.length > 0) {
        const imageArray: { path: string; publicId: string }[] = [];

        for (const file of files) {
            try {
                const { path, public_id } = await upload(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            } catch (error) {
                console.error("Image upload failed for one file:", error);
                // Continue with other images
            }
        }

        product.images = imageArray as any;    
    }

    const savedProduct = await product.save();

    sendResponse(res, {
        data: savedProduct,
        message: 'Product created successfully',
        statusCode: 201,
    });
});

//* UPDATE PRODUCT (Multiple Images)
export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const validatedData = updateProductSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError('Product not found', 404);
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
                        await deleteFromCloudinary(img.publicId);
                    }
                }
            }

            // Upload new images
            const imageArray: { path: string; publicId: string }[] = [];

            for (const file of files) {
                const { path, public_id } = await upload(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            }

           product.images = imageArray as any;

        } catch (error) {
            console.error("Image update error:", error);
            throw new ApiError("Failed to update product images", 500);
        }
    }

    const updatedProduct = await product.save();

    sendResponse(res, {
        data: updatedProduct,
        message: 'Product updated successfully',
        statusCode: 200,
    });
});

//* GET ALL PRODUCTS
export const getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { category, search, page = 1, limit = 10 } = req.query;

        // Query building
        const query: any = { isActive: true };

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
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean(); // Optional: faster response

        // Get total count
        const total = await Product.countDocuments(query);

        sendResponse(res, {
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
    }
);

//* GET PRODUCT BY ID
export const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    sendResponse(res, {
        data: product,
        message: 'Product fetched successfully',
        statusCode: 200,
    });
});

//* GET PRODUCTS BY CATEGORY
export const getProductsByCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!category) {
        throw new ApiError('Category is required', 400);
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));

    const query = { category, isActive: true };

    const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const total = await Product.countDocuments(query);

    sendResponse(res, {
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
export const getProductsByBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { brand } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!brand) {
        throw new ApiError('Brand is required', 400);
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));

    const query = { brand, isActive: true };

    const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const total = await Product.countDocuments(query);

    sendResponse(res, {
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
export const getFeaturedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const limit = Math.min(20, Number(req.query.limit) || 8);   // safe limit

    const products = await Product.find({ isActive: true })
        .sort({ averageRating: -1, createdAt: -1 })
        .limit(limit);

    sendResponse(res, {
        data: products,
        message: 'Featured products fetched successfully',
        statusCode: 200,
    });
});

//* GET NEW ARRIVALS
export const getNewArrivals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const limit = Math.min(20, Number(req.query.limit) || 10);

    const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit);

    sendResponse(res, {
        data: products,
        message: 'New arrivals fetched successfully',
        statusCode: 200,
    });
});

//* DELETE PRODUCT
export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    sendResponse(res, {
        message: 'Product deleted successfully',
        statusCode: 200,
    });
});