import { Request, Response } from 'express';
import Order from '../models/order.model';
import Cart from '../models/cart.model';
import User from '../models/user.model';
import Product from '../models/product.model';
import { catchAsync } from '../utils/catchAsyn.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { ApiError } from '../utils/apiError.utils';
import { OrderStatus, PaymentMethod, PaymentStatus, Role } from '../@types/enum.types';

// ==========================================
// USER CONTROLLERS
// ==========================================

// 1. CREATE ORDER (Cash on Delivery)
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    throw new ApiError('Please login to place an order', 401);
  }

  const { shippingAddress, paymentMethod = PaymentMethod.COD, notes, items: customItems } = req.body;

  let orderItems: Array<{
    product: any;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
    image?: string;
  }> = [];

  // Check if items were sent directly or need to be pulled from Cart
  if (customItems && Array.isArray(customItems) && customItems.length > 0) {
    for (const item of customItems) {
      const prod: any = await Product.findById(item.product);
      if (!prod) {
        throw new ApiError(`Product not found with id ${item.product}`, 404);
      }
      if (prod.stock < item.quantity) {
        throw new ApiError(
          `Insufficient stock for "${prod.name}". Available stock: ${prod.stock}`,
          400
        );
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
  } else {
    // Read from User's active cart
    const cart: any = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ApiError('Your cart is empty. Please add items to cart before placing an order.', 400);
    }

    for (const item of cart.items) {
      const prod = item.product;
      if (!prod) {
        throw new ApiError('One or more products in your cart no longer exist', 400);
      }
      if (prod.stock < item.quantity) {
        throw new ApiError(
          `Insufficient stock for "${prod.name}". Available: ${prod.stock}`,
          400
        );
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
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Generate unique human-readable order number
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${timestamp}-${randomSuffix}`;

  // Create Order in DB
  const order = await Order.create({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || PaymentMethod.COD,
    paymentStatus: PaymentStatus.PENDING,
    orderStatus: OrderStatus.PENDING,
    itemsPrice,
    shippingFee,
    totalAmount,
    notes,
  });

  // Clear user's cart after successful order creation
  await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });

  sendResponse(res, {
    data: order,
    message: 'Order placed successfully with Cash on Delivery',
    statusCode: 201,
  });
});

// 2. GET MY ORDERS (Current user order history)
export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    throw new ApiError('Please login to view your orders', 401);
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images image');

  sendResponse(res, {
    data: orders,
    message: 'Orders fetched successfully',
    statusCode: 200,
  });
});

// 3. GET SINGLE ORDER BY ID
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id || req.user?.id;
  const userRole = req.user?.role;

  if (!userId) {
    throw new ApiError('Please login to view this order', 401);
  }

  const order = await Order.findById(id)
    .populate('user', 'full_name name email phone')
    .populate('items.product', 'name images image stock');

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Allow only the owner or admins to view this order
  const isOwner = order.user && (order.user._id ? order.user._id.toString() : order.user.toString()) === userId.toString();
  const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError('You are not authorized to view this order', 403);
  }

  sendResponse(res, {
    data: order,
    message: 'Order details fetched successfully',
    statusCode: 200,
  });
});

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// 4. GET ALL ORDERS (Admin)
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    search,
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter: any = {};

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

  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .populate('user', 'full_name name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  sendResponse(res, {
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
export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus, status, paymentStatus } = req.body;

  const newStatus = (orderStatus || status) as OrderStatus;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  const prevStatus = order.orderStatus;

  // Status transitions handling
  if (newStatus && newStatus !== prevStatus) {
    // If order is cancelled, restore stock
    if (newStatus === OrderStatus.CANCELLED && prevStatus !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      order.cancelledAt = new Date();
    }

    // If order was cancelled and now re-opened, re-deduct stock
    if (prevStatus === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
      order.cancelledAt = undefined;
    }

    // If delivered
    if (newStatus === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
      // For Cash on Delivery, mark as paid upon delivery if not specified otherwise
      if (order.paymentMethod === PaymentMethod.COD && !paymentStatus) {
        order.paymentStatus = PaymentStatus.PAID;
      }
    }

    order.orderStatus = newStatus;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus as PaymentStatus;
  }

  await order.save();

  sendResponse(res, {
    data: order,
    message: `Order status updated to "${order.orderStatus}" successfully`,
    statusCode: 200,
  });
});
