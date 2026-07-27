import mongoose, { Schema, Document } from 'mongoose';
import { generateSlug } from '../middlewares/slug.middleware';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: { path: string; publicId: string };
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,                    
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
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
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      path: String,
      publicId: String,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


categorySchema.index({ parentCategory: 1 });

// Apply slug middleware
generateSlug(categorySchema);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;