"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_types_1 = require("../@types/enum.types");
const orderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    variant: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
}, { _id: true });
const shippingAddressSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true,
    },
    postalCode: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'Order must contain at least one item',
        },
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(enum_types_1.PaymentMethod),
        default: enum_types_1.PaymentMethod.COD,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(enum_types_1.PaymentStatus),
        default: enum_types_1.PaymentStatus.PENDING,
    },
    orderStatus: {
        type: String,
        enum: Object.values(enum_types_1.OrderStatus),
        default: enum_types_1.OrderStatus.PENDING,
        index: true,
    },
    itemsPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    shippingFee: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: String,
        trim: true,
    },
    deliveredAt: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
