import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';

// CART CONTROLLERS 

// ADD TO CART
export const addToCart = catchAsync(async (req: Request, res: Response) => {
    const { product, quantity = 1, variant } = req.body;
    const userId = req.user?.id;   // Assuming auth middleware sets req.user

    if (!userId) {
        throw new ApiError('Please login to add items to cart', 401);
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

    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
        // Add new item
        cart.items.push({
            product,
            quantity: Number(quantity),
            price: req.body.price,       
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
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError('Please login to view cart', 401);
    }

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: 'items.product',
            select: 'name price images slug'   // adjust fields as needed
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
    const userId = req.user?.id;

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
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

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
    const userId = req.user?.id;

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
    const userId = req.user?.id;

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