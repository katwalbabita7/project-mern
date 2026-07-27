import cloudinary from "../config/cloudinary.config";
import fs from "fs";
import { ApiError } from "./apiError.utils";

export const upload = async (
  file: Express.Multer.File,
  dir = "/"
) => {
  try {
    if (!file?.path) {
      throw new Error("No file path received from Multer");
    }

    const folder = "/PROJECT" + dir;


    const result = await cloudinary.uploader.upload(file.path, {
      unique_filename: true,
      folder: folder,
      transformation:{
        width: 1000,
        height: 1000,
        crop: "fill",        
        format: "auto", 
        gravity: "face",

      },
      
    });

    // Delete temp file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      path: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    // console.error(" Cloudinary Upload FAILED:", {
    //   message: error.message,
    //   name: error.name,
    //   stack: error.stack,
    // });
    throw new ApiError("Failed to upload file to Cloudinary", 500);
  }
};


// * Delete image from Cloudinary
export const deleteFromCloudinary = async (public_id: string): Promise<void> => {
    try {
        if (!public_id) {
            console.warn("deleteFromCloudinary called without public_id");
            return;
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === "ok") {
            console.log(`Cloudinary image deleted: ${public_id}`);
        } else {
            console.warn(`Cloudinary delete warning for ${public_id}:`, result);
        }
    } catch (error: any) {
        console.error(`Cloudinary delete failed for ${public_id}:`, error.message);
        // Important: Do NOT throw error here in most cases (optional delete)
        // throw new ApiError(`Failed to delete image`, 500);
    }
};