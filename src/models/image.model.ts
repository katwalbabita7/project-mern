import mongoose from "mongoose";
// Image schema
export const imageSchema = new mongoose.Schema({
        path: {
            type: String,
            required: [true, "path is required"],
        },

        publicId: {
            type: String,
            required: [true, "Public ID is required"],
            unique: true,
        },
});