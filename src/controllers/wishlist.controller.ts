import { Request, Response } from 'express';
import Wishlist from '../models/wishlist.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';


// GET MY WISHLIST
export const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;   // from auth middleware

    const wishlist = await Wishlist.findOne({ user: userId })
        .populate({
            path: 'products',
            select: 'name price images slug brand category', // जे fields चाहिन्छ ती राख्नु
            populate: [
                { path: 'brand', select: 'name' },
                { path: 'category', select: 'name' }
            ]
        });

    sendResponse(res, {
        data: wishlist?.products || [],
        message: "Wishlist fetched successfully",
        statusCode: 200,
    });
});

// ADD TO WISHLIST
export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
        throw new ApiError("Product already in wishlist", 400);
    }

    wishlist.products.push(productId);
    await wishlist.save();

    sendResponse(res, {
        message: "Product added to wishlist",
        statusCode: 200,
    });
});

// REMOVE FROM WISHLIST
export const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        throw new ApiError("Wishlist not found", 404);
    }

    wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
    );

    await wishlist.save();

    sendResponse(res, {
        message: "Product removed from wishlist",
        statusCode: 200,
    });
});