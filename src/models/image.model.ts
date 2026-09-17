import mongoose from "mongoose";
// Image schema
export const imageSchema = new mongoose.Schema({
    path: {
        type: String,
        required: [true, "path is required"],
    },
    publicId: {
        type: String,
        default: "",
    },
}, { _id: false });