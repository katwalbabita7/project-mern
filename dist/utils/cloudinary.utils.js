"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.upload = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
const apiError_utils_1 = require("./apiError.utils");
const upload = async (file, dir = "/") => {
    try {
        if (!file?.path) {
            throw new Error("No file path received from Multer");
        }
        const folder = "/PROJECT" + dir;
        const result = await cloudinary_config_1.default.uploader.upload(file.path, {
            unique_filename: true,
            folder: folder,
            transformation: {
                width: 1000,
                height: 1000,
                crop: "fill",
                format: "auto",
                gravity: "face",
            },
        });
        // Delete temp file
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        return {
            path: result.secure_url,
            public_id: result.public_id,
        };
    }
    catch (error) {
        // console.error(" Cloudinary Upload FAILED:", {
        //   message: error.message,
        //   name: error.name,
        //   stack: error.stack,
        // });
        throw new apiError_utils_1.ApiError("Failed to upload file to Cloudinary", 500);
    }
};
exports.upload = upload;
// * Delete image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) {
            console.warn("deleteFromCloudinary called without public_id");
            return;
        }
        const result = await cloudinary_config_1.default.uploader.destroy(public_id);
        if (result.result === "ok") {
            console.log(`Cloudinary image deleted: ${public_id}`);
        }
        else {
            console.warn(`Cloudinary delete warning for ${public_id}:`, result);
        }
    }
    catch (error) {
        console.error(`Cloudinary delete failed for ${public_id}:`, error.message);
        // Important: Do NOT throw error here in most cases (optional delete)
        // throw new ApiError(`Failed to delete image`, 500);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
