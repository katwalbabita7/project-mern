import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from '../validators/order.validator';

const router = express.Router();

// ==========================================
// ADMIN ROUTES (Placed before parameterized :id)
// ==========================================

// Get all orders (Admin with filters, search, pagination)
router.get(
  '/admin/all',
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  getAllOrders
);

// Update order status (Admin)
router.patch(
  '/admin/:id/status',
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  validateUpdateOrderStatus,
  updateOrderStatus
);

router.put(
  '/admin/:id/status',
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  validateUpdateOrderStatus,
  updateOrderStatus
);

// ==========================================
// USER ROUTES
// ==========================================

// Create new order (COD)
router.post(
  '/',
  authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
  validateCreateOrder,
  createOrder
);

// Get current user's orders
router.get(
  '/my-orders',
  authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
  getMyOrders
);

// Get single order details
router.get(
  '/:id',
  authenticate([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
  getOrderById
);

export default router;
