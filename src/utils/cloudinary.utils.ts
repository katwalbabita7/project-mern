
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

// * delete file
export const removeFile = async (public_id: string): Promise<void> => {
  try {
    if (!public_id) {
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      console.warn(`Cloudinary delete warning: ${result.result}`);
    }

    console.log(`✅ Cloudinary image deleted: ${public_id}`);
  } catch (error: any) {
    console.error("Cloudinary delete failed:", error);
    throw new ApiError(`Failed to delete image from Cloudinary: ${error.message}`, 500);
  }
};