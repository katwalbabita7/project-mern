import mongoose from "mongoose";
import { imageSchema } from "./image.model";

export const productSchema = new mongoose.Schema({
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
            validator: function(value: number | undefined): boolean {
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
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Brand is required'],
        ref:"Brand",
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'category is required'],
        ref:"category",
        trim: true,
    },
    
    // Single main image (URL)
    image: {
        type: imageSchema,
        required: [true, 'Main product image is required'],
    },
    
    // Multiple images support
    images: [{
        type: imageSchema, // URLs
        default:null,
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
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for final price (with discount)
productSchema.virtual('finalPrice').get(function() {
    return this.discountPrice || this.price;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;