"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const apiError_utils_1 = require("../utils/apiError.utils");
const enum_types_1 = require("../@types/enum.types");
// ==========================================
// USER CONTROLLERS
// ==========================================
// 1. CREATE ORDER (Cash on Delivery)
exports.createOrder = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login to place an order', 401);
    }
    const { shippingAddress, paymentMethod = enum_types_1.PaymentMethod.COD, notes, items: customItems } = req.body;
    let orderItems = [];
    // Check if items were sent directly or need to be pulled from Cart
    if (customItems && Array.isArray(customItems) && customItems.length > 0) {
        for (const item of customItems) {
            const prod = await product_model_1.default.findById(item.product);
            if (!prod) {
                throw new apiError_utils_1.ApiError(`Product not found with id ${item.product}`, 404);
            }
            if (prod.stock < item.quantity) {
                throw new apiError_utils_1.ApiError(`Insufficient stock for "${prod.name}". Available stock: ${prod.stock}`, 400);
            }
            const itemPrice = item.price ?? prod.discountPrice ?? prod.price;
            const itemImage = prod.image?.path || (prod.images && prod.images[0]?.path) || '';
            orderItems.push({
                product: prod._id,
                name: prod.name,
                price: Number(itemPrice),
                quantity: Number(item.quantity),
                variant: item.variant,
                image: itemImage,
            });
        }
    }
    else {
        // Read from User's active cart
        const cart = await cart_model_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new apiError_utils_1.ApiError('Your cart is empty. Please add items to cart before placing an order.', 400);
        }
        for (const item of cart.items) {
            const prod = item.product;
            if (!prod) {
                throw new apiError_utils_1.ApiError('One or more products in your cart no longer exist', 400);
            }
            if (prod.stock < item.quantity) {
                throw new apiError_utils_1.ApiError(`Insufficient stock for "${prod.name}". Available: ${prod.stock}`, 400);
            }
            const itemPrice = item.price ?? prod.discountPrice ?? prod.price;
            const itemImage = prod.image?.path || (prod.images && prod.images[0]?.path) || '';
            orderItems.push({
                product: prod._id,
                name: prod.name,
                price: Number(itemPrice),
                quantity: Number(item.quantity),
                variant: item.variant,
                image: itemImage,
            });
        }
    }
    // Calculate pricing breakdown
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = itemsPrice > 2000 ? 0 : 100;
    const totalAmount = itemsPrice + shippingFee;
    // Deduct stock from products
    for (const item of orderItems) {
        await product_model_1.default.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
        });
    }
    // Generate unique human-readable order number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${timestamp}-${randomSuffix}`;
    // Create Order in DB
    const order = await order_model_1.default.create({
        orderNumber,
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || enum_types_1.PaymentMethod.COD,
        paymentStatus: enum_types_1.PaymentStatus.PENDING,
        orderStatus: enum_types_1.OrderStatus.PENDING,
        itemsPrice,
        shippingFee,
        totalAmount,
        notes,
    });
    // Clear user's cart after successful order creation
    await cart_model_1.default.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: order,
        message: 'Order placed successfully with Cash on Delivery',
        statusCode: 201,
    });
});
// 2. GET MY ORDERS (Current user order history)
exports.getMyOrders = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login to view your orders', 401);
    }
    const orders = await order_model_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name images image');
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: orders,
        message: 'Orders fetched successfully',
        statusCode: 200,
    });
});
// 3. GET SINGLE ORDER BY ID
exports.getOrderById = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
        throw new apiError_utils_1.ApiError('Please login to view this order', 401);
    }
    const order = await order_model_1.default.findById(id)
        .populate('user', 'full_name name email phone')
        .populate('items.product', 'name images image stock');
    if (!order) {
        throw new apiError_utils_1.ApiError('Order not found', 404);
    }
    // Allow only the owner or admins to view this order
    const isOwner = order.user && (order.user._id ? order.user._id.toString() : order.user.toString()) === userId.toString();
    const isAdmin = userRole === enum_types_1.Role.ADMIN || userRole === enum_types_1.Role.SUPER_ADMIN;
    if (!isOwner && !isAdmin) {
        throw new apiError_utils_1.ApiError('You are not authorized to view this order', 403);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: order,
        message: 'Order details fetched successfully',
        statusCode: 200,
    });
});
// ==========================================
// ADMIN CONTROLLERS
// ==========================================
// 4. GET ALL ORDERS (Admin)
exports.getAllOrders = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, status, paymentStatus, search, } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const filter = {};
    if (status && status !== 'all') {
        filter.orderStatus = status;
    }
    if (paymentStatus && paymentStatus !== 'all') {
        filter.paymentStatus = paymentStatus;
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
            { orderNumber: searchRegex },
            { 'shippingAddress.fullName': searchRegex },
            { 'shippingAddress.phone': searchRegex },
            { 'shippingAddress.city': searchRegex },
        ];
    }
    const total = await order_model_1.default.countDocuments(filter);
    const orders = await order_model_1.default.find(filter)
        .populate('user', 'full_name name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: orders,
        message: 'Orders retrieved successfully',
        statusCode: 200,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    });
});
// 5. UPDATE ORDER STATUS & PAYMENT STATUS (Admin)
exports.updateOrderStatus = (0, catchAsyn_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { orderStatus, status, paymentStatus } = req.body;
    const newStatus = (orderStatus || status);
    const order = await order_model_1.default.findById(id);
    if (!order) {
        throw new apiError_utils_1.ApiError('Order not found', 404);
    }
    const prevStatus = order.orderStatus;
    // Status transitions handling
    if (newStatus && newStatus !== prevStatus) {
        // If order is cancelled, restore stock
        if (newStatus === enum_types_1.OrderStatus.CANCELLED && prevStatus !== enum_types_1.OrderStatus.CANCELLED) {
            for (const item of order.items) {
                await product_model_1.default.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity },
                });
            }
            order.cancelledAt = new Date();
        }
        // If order was cancelled and now re-opened, re-deduct stock
        if (prevStatus === enum_types_1.OrderStatus.CANCELLED && newStatus !== enum_types_1.OrderStatus.CANCELLED) {
            for (const item of order.items) {
                await product_model_1.default.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity },
                });
            }
            order.cancelledAt = undefined;
        }
        // If delivered
        if (newStatus === enum_types_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
            // For Cash on Delivery, mark as paid upon delivery if not specified otherwise
            if (order.paymentMethod === enum_types_1.PaymentMethod.COD && !paymentStatus) {
                order.paymentStatus = enum_types_1.PaymentStatus.PAID;
            }
        }
        order.orderStatus = newStatus;
    }
    if (paymentStatus) {
        order.paymentStatus = paymentStatus;
    }
    await order.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: order,
        message: `Order status updated to "${order.orderStatus}" successfully`,
        statusCode: 200,
    });
});
