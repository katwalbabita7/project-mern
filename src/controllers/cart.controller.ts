import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Product from '../models/product.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';

// CART CONTROLLERS 

// ADD TO CART
export const addToCart = catchAsync(async (req: Request, res: Response) => {
    const { product, quantity = 1, variant } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError('Please login to add items to cart', 401);
    }

    // Product fetch + stock check
    const prod = await Product.findById(product);
    if (!prod) {
        throw new ApiError('Product not found', 404);
    }

    let price = req.body.price;
    if (price === undefined || price === null) {
        price = prod.discountPrice || prod.price;
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === product &&
                (!variant || item.variant === variant)
    );

    const currentQty = existingItemIndex > -1
        ? cart.items[existingItemIndex].quantity
        : 0;
    const newQty = currentQty + Number(quantity);

    // Stock check
    if (newQty > prod.stock) {
        throw new ApiError(`Only ${prod.stock} available in stock`, 400);
    }

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = newQty;
    } else {
        cart.items.push({
            product,
            quantity: Number(quantity),
            price: Number(price),
            variant
        });
    }

    await cart.save();

    sendResponse(res, {
        data: cart,
        message: "Item added to cart successfully",
        statusCode: 200,
    });
});

// GET MY CART
export const getMyCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError('Please login to view cart', 401);
    }

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: 'items.product',
            select: 'name price discountPrice image images stock slug' 
        });

    if (!cart) {
        // Return empty cart structure
        return sendResponse(res, {
            data: { items: [], totalAmount: 0 },
            message: "Cart is empty",
            statusCode: 200,
        });
    }

    sendResponse(res, {
        data: cart,
        message: "Cart fetched successfully",
        statusCode: 200,
    });
});

// UPDATE CART ITEM QUANTITY
export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity, variant } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError('Please login', 401);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId &&
                (!variant || item.variant === variant)
    );

    if (itemIndex === -1) {
        throw new ApiError('Item not found in cart', 404);
    }

    if (quantity < 1) {
        cart.items.splice(itemIndex, 1);
    } else {
        // Stock check
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError('Product not found', 404);
        }
        if (Number(quantity) > product.stock) {
            throw new ApiError(`Only ${product.stock} available in stock`, 400);
        }

        cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    // populate return
    await cart.populate({
        path: 'items.product',
        select: 'name price discountPrice image images stock slug'
    });

    sendResponse(res, {
        data: cart,
        message: "Cart updated successfully",
        statusCode: 200,
    });
});
// REMOVE ITEM FROM CART
export const removeFromCart = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { variant } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError('Please login', 401);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    cart.items = cart.items.filter(item => 
        !(item.product.toString() === productId && 
          (!variant || item.variant === variant))
    );

    await cart.save();

    sendResponse(res, {
        data: cart,
        message: "Item removed from cart successfully",
        statusCode: 200,
    });
});

// CLEAR CART
export const clearCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError('Please login', 401);
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
        cart.items = [];
        await cart.save();
    }

    sendResponse(res, {
        message: "Cart cleared successfully",
        statusCode: 200,
    });
});