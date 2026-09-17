import { validate } from '../middlewares/validator.middleware';
import { z } from 'zod';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../@types/enum.types';

// MongoDB ID validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

// Create Order Schema
export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().trim().min(2, 'Full name is required'),
      phone: z.string().trim().min(7, 'Phone number must be at least 7 digits'),
      city: z.string().trim().min(2, 'City is required'),
      address: z.string().trim().min(3, 'Delivery address is required'),
      postalCode: z.string().trim().optional().nullable(),
      state: z.string().trim().optional().nullable(),
    }),
    paymentMethod: z
      .nativeEnum(PaymentMethod)
      .optional()
      .default(PaymentMethod.COD),
    notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
    items: z
      .array(
        z.object({
          product: mongoIdSchema,
          quantity: z
            .union([z.number(), z.string()])
            .optional()
            .transform((val) => (val !== undefined && val !== null ? Number(val) : 1))
            .pipe(z.number().min(1, 'Quantity must be at least 1')),
          variant: z.string().trim().optional().nullable(),
          price: z.number().min(0).optional(),
        })
      )
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Update Order Status Schema (Admin)
export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  }),
  params: z.object({
    id: mongoIdSchema,
  }),
  query: z.object({}).optional(),
});

// Export validators
export const validateCreateOrder = validate(createOrderSchema);
export const validateUpdateOrderStatus = validate(updateOrderStatusSchema);
