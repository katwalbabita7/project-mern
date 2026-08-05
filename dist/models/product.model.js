"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = require("./image.model");
exports.productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative'],
        validate: {
            validator: function (value) {
                return !value || value < this.price;
            },
            message: 'Discount price must be less than original price'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Brand is required'],
        ref: "Brand",
        trim: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'category is required'],
        ref: "category",
        trim: true,
    },
    // Single main image (URL)
    image: {
        type: image_model_1.imageSchema,
        required: [true, 'Main product image is required'],
    },
    // Multiple images support
    images: [{
            type: image_model_1.imageSchema, // URLs
            default: null,
        }],
    tags: [{
            type: String,
            trim: true,
        }],
    isActive: {
        type: Boolean,
        default: true,
    },
    // ratings
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    new_arrival: {
        type: Boolean,
        default: true,
    },
    is_feature: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for final price (with discount)
exports.productSchema.virtual('finalPrice').get(function () {
    return this.discountPrice || this.price;
});
// Index for better search performance
exports.productSchema.index({ name: 'text', description: 'text' });
exports.productSchema.index({ category: 1 });
const Product = mongoose_1.default.model('Product', exports.productSchema);
exports.default = Product;
