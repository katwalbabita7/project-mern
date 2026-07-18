import mongoose, { Schema, Document, Model } from 'mongoose';
import { IImage } from '../@types/globel.types';
import { imageSchema } from './image.model';

// Interface for TypeScript type safety
export interface IBrand extends Document {
  name: string;
  publicId: string;
  description?: string;
  logo?: IImage;
}

// Mongoose Schema
const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      unique: [true, "Brand already exists with provided name"],
      maxlength: [100, 'Brand name cannot exceed 100 characters'],
    },

     logo: {
        type: imageSchema,
        required: [true, "logo is required"],
    },
    
    description: {
      type: String,
      trim: true,
      required: false,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
  },
  {
    timestamps: true,        
  }
);


// Create and export the model
const Brand: Model<IBrand> = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;