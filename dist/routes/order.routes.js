"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const order_validator_1 = require("../validators/order.validator");
const router = express_1.default.Router();
// ==========================================
// ADMIN ROUTES (Placed before parameterized :id)
// ==========================================
// Get all orders (Admin with filters, search, pagination)
router.get('/admin/all', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_controller_1.getAllOrders);
// Update order status (Admin)
router.patch('/admin/:id/status', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_validator_1.validateUpdateOrderStatus, order_controller_1.updateOrderStatus);
router.put('/admin/:id/status', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_validator_1.validateUpdateOrderStatus, order_controller_1.updateOrderStatus);
// ==========================================
// USER ROUTES
// ==========================================
// Create new order (COD)
router.post('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_validator_1.validateCreateOrder, order_controller_1.createOrder);
// Get current user's orders
router.get('/my-orders', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_controller_1.getMyOrders);
// Get single order details
router.get('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), order_controller_1.getOrderById);
exports.default = router;
