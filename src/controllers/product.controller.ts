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
    const {
        name,
        price,
        discountPrice,
        stock,
        sku,
        brand,
        category,
        description,
        tags,
        isActive,
        new_arrival,
        is_feature,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const singleFile = req.file;

    let parsedTags: string[] = [];
    if (tags) {
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch {
                parsedTags = tags.split(',').map((t: string) => t.trim());
            }
        } else if (Array.isArray(tags)) {
            parsedTags = tags;
        }
    }

    let calculatedDiscountPrice: number | undefined = undefined;
    if (discountPrice !== undefined && discountPrice !== '' && discountPrice !== null && !isNaN(Number(discountPrice))) {
        calculatedDiscountPrice = Number(discountPrice);
    } else if (req.body.discountPercent !== undefined && req.body.discountPercent !== '' && !isNaN(Number(req.body.discountPercent))) {
        const pct = Number(req.body.discountPercent);
        if (pct > 0 && pct < 100 && price) {
            calculatedDiscountPrice = Math.round(Number(price) * (1 - pct / 100) * 100) / 100;
        }
    }

    const product = new Product({
        name: name?.trim(),
        price: Number(price),
        discountPrice: calculatedDiscountPrice,
        stock: stock !== undefined && stock !== '' ? Number(stock) : 0,
        sku: sku || undefined,
        brand,
        category,
        description: description?.trim(),
        tags: parsedTags,
        isActive: isActive === undefined ? true : String(isActive) === 'true',
        new_arrival: new_arrival === undefined ? true : String(new_arrival) === 'true',
        is_feature: is_feature === undefined ? false : String(is_feature) === 'true',
    });

    // Handle Image Uploads
    const allFiles: Express.Multer.File[] = [];
    if (files && files.length > 0) {
        allFiles.push(...files);
    }
    if (singleFile) {
        allFiles.push(singleFile);
    }

    if (allFiles.length > 0) {
        const imageArray: { path: string; publicId: string }[] = [];

        for (const file of allFiles) {
            try {
                const { path, public_id } = await upload(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            } catch (error) {
                console.error("Image upload failed for one file:", error);
            }
        }

        if (imageArray.length > 0) {
            product.image = imageArray[0];
            product.images = imageArray as any;
        }
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
    const {
        name,
        price,
        discountPrice,
        stock,
        sku,
        brand,
        category,
        description,
        tags,
        isActive,
        new_arrival,
        is_feature,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const singleFile = req.file;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) {
        product.discountPrice = discountPrice !== '' && discountPrice !== null && !isNaN(Number(discountPrice)) ? Number(discountPrice) : undefined;
    } else if (req.body.discountPercent !== undefined) {
        const pct = Number(req.body.discountPercent);
        const currentPrice = price !== undefined ? Number(price) : product.price;
        if (pct > 0 && pct < 100 && currentPrice) {
            product.discountPrice = Math.round(currentPrice * (1 - pct / 100) * 100) / 100;
        } else {
            product.discountPrice = undefined;
        }
    }
    if (stock !== undefined) product.stock = Number(stock);
    if (sku !== undefined) {
        product.sku = typeof sku === 'string' && sku.trim() ? sku.trim().toUpperCase() : undefined;
    }
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = typeof description === 'string' ? description.trim() : '';
    if (isActive !== undefined) product.isActive = String(isActive) === 'true';
    if (new_arrival !== undefined) product.new_arrival = String(new_arrival) === 'true';
    if (is_feature !== undefined) product.is_feature = String(is_feature) === 'true';

    if (tags !== undefined) {
        if (typeof tags === 'string') {
            try {
                product.tags = JSON.parse(tags);
            } catch {
                product.tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            }
        } else if (Array.isArray(tags)) {
            product.tags = tags;
        }
    }

    // Handle Images Update
    const allFiles: Express.Multer.File[] = [];
    if (files && files.length > 0) allFiles.push(...files);
    if (singleFile) allFiles.push(singleFile);

    if (allFiles.length > 0) {
        try {
            // Delete old images from Cloudinary
            if (product.images && product.images.length > 0) {
                for (const img of product.images) {
                    if (img.publicId) {
                        await deleteFromCloudinary(img.publicId).catch(console.error);
                    }
                }
            } else if (product.image?.publicId) {
                await deleteFromCloudinary(product.image.publicId).catch(console.error);
            }

            // Upload new images
            const imageArray: { path: string; publicId: string }[] = [];
            for (const file of allFiles) {
                const { path, public_id } = await upload(file, uploadFolder);
                imageArray.push({
                    path,
                    publicId: public_id,
                });
            }

            if (imageArray.length > 0) {
                product.image = imageArray[0];
                product.images = imageArray as any;
            }
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
        const { category, brand, search, page = 1, limit = 12 } = req.query;

        // Query building
        const isAdmin = req.baseUrl.includes('admin') || req.originalUrl.includes('/admin');
        const query: any = {};

        if (!isAdmin) {
            query.isActive = true;
        } else if (req.query.isActive !== undefined) {
            query.isActive = String(req.query.isActive) === 'true';
        }

        if (category) {
            query.category = category;
        }

        if (brand) {
            query.brand = brand;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNumber - 1) * limitNumber;

        // Get products with populated category and brand
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('brand', 'name logo')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean();

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
    const product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('brand', 'name logo');

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
    const { page = 1, limit = 12 } = req.query;

    if (!category) {
        throw new ApiError('Category is required', 400);
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));

    const query = { category, isActive: true };

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .populate('brand', 'name logo')
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
    const { page = 1, limit = 12 } = req.query;

    if (!brand) {
        throw new ApiError('Brand is required', 400);
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));

    const query = { brand, isActive: true };

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .populate('brand', 'name logo')
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
    const limit = Math.min(20, Number(req.query.limit) || 8);

    const products = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .populate('brand', 'name logo')
        .sort({ is_feature: -1, averageRating: -1, createdAt: -1 })
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
        .populate('category', 'name slug')
        .populate('brand', 'name logo')
        .sort({ new_arrival: -1, createdAt: -1 })
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