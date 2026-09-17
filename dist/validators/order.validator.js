"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateOrderStatus = exports.validateCreateOrder = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const validator_middleware_1 = require("../middlewares/validator.middleware");
const zod_1 = require("zod");
const enum_types_1 = require("../@types/enum.types");
// MongoDB ID validation
const mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');
// Create Order Schema
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        shippingAddress: zod_1.z.object({
            fullName: zod_1.z.string().trim().min(2, 'Full name is required'),
            phone: zod_1.z.string().trim().min(7, 'Phone number must be at least 7 digits'),
            city: zod_1.z.string().trim().min(2, 'City is required'),
            address: zod_1.z.string().trim().min(3, 'Delivery address is required'),
            postalCode: zod_1.z.string().trim().optional().nullable(),
            state: zod_1.z.string().trim().optional().nullable(),
        }),
        paymentMethod: zod_1.z
            .nativeEnum(enum_types_1.PaymentMethod)
            .optional()
            .default(enum_types_1.PaymentMethod.COD),
        notes: zod_1.z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
        items: zod_1.z
            .array(zod_1.z.object({
            product: mongoIdSchema,
            quantity: zod_1.z
                .union([zod_1.z.number(), zod_1.z.string()])
                .optional()
                .transform((val) => (val !== undefined && val !== null ? Number(val) : 1))
                .pipe(zod_1.z.number().min(1, 'Quantity must be at least 1')),
            variant: zod_1.z.string().trim().optional().nullable(),
            price: zod_1.z.number().min(0).optional(),
        }))
            .optional(),
    }),
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
});
// Update Order Status Schema (Admin)
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.nativeEnum(enum_types_1.OrderStatus).optional(),
        status: zod_1.z.nativeEnum(enum_types_1.OrderStatus).optional(),
        paymentStatus: zod_1.z.nativeEnum(enum_types_1.PaymentStatus).optional(),
    }),
    params: zod_1.z.object({
        id: mongoIdSchema,
    }),
    query: zod_1.z.object({}).optional(),
});
// Export validators
exports.validateCreateOrder = (0, validator_middleware_1.validate)(exports.createOrderSchema);
exports.validateUpdateOrderStatus = (0, validator_middleware_1.validate)(exports.updateOrderStatusSchema);
