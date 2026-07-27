import mongoose, { Schema, Document, Model } from 'mongoose';
import { imageSchema } from './image.model';
import { generateUniqueSlug } from '../utils/slug.utils';

export interface IBrand extends Document {
    name: string;
    slug: string;
    description?: string;
    logo?: {
        path: string;
        publicId: string;
    };
    isActive: boolean;
}

const brandSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            trim: true,
            unique: true,
            maxlength: [100, 'Brand name cannot exceed 100 characters'],
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },

        logo: {
            type: imageSchema,
            required: [true, 'Brand logo is required'],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Pre-save Middleware
brandSchema.pre('save', async function (next: any) {
    if (this.isModified('name') || !this.slug) {
        try {
            const uniqueSlug = await generateUniqueSlug(
                this.name,
                mongoose.models.Brand,
                this._id ? this._id.toString() : undefined
            );
            this.slug = uniqueSlug;
        } catch (error) {
            console.error('Slug generation error:', error);
        }
    }
    next();
});

const Brand: Model<IBrand> = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;